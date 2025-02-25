import { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { AuthContext } from '../../../AuthProvider/AuthProvider';

const ExpenseInsights = () => {
    const {user} = useContext(AuthContext)
    const [expenses, setExpenses] = useState([]);
    const [budget, setBudget] = useState(null);
    console.log(budget)
    const [aiInsights, setAiInsights] = useState('');
    const [alerts, setAlerts] = useState([]);
    const [model, setModel] = useState(null);
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    // TensorFlow.js Model Configuration
    const createModel = useCallback(() => {
        const model = tf.sequential({
            layers: [
                tf.layers.dense({
                    inputShape: [6],
                    units: 32,
                    activation: 'relu',
                    kernelInitializer: 'heNormal'
                }),
                tf.layers.dropout({ rate: 0.2 }),
                tf.layers.dense({
                    units: 16,
                    activation: 'relu'
                }),
                tf.layers.dense({
                    units: 3,
                    activation: 'softmax'
                })
            ]
        });

        model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        return model;
    }, []);

    // Load TF.js model on mount
    useEffect(() => {
        const loadModel = async () => {
            const newModel = createModel();
            setModel(newModel);
        };
        loadModel();
    }, [createModel]);

    // Fetch expense and budget data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [expensesRes, budgetRes] = await Promise.all([
                    axios.get('http://localhost:5000/expenses'),
                    axios.get('http://localhost:5000/budget')
                ]);
                setExpenses(expensesRes?.data ?? []);
                setBudget(budgetRes?.data ?? null);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

// Prepare data for TensorFlow.js
const prepareData = useCallback(() => {
    if (!expenses?.length || !budget) return null;

    const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Others', 'Savings'];
    
    // Fix: Properly handle maxAmount with a valid fallback
    const maxAmount = Math.max(1, ...expenses.map(e => parseFloat(e?.amount ?? 0)));

    return expenses.map(expense => {
        const date = new Date(expense?.dateTime);
        const label = parseFloat(expense?.amount ?? 0) > (budget?.monthly?.[expense?.category] ?? 0) ? 0 : 
                      parseFloat(expense?.amount ?? 0) > ((budget?.monthly?.[expense?.category] ?? 0) * 0.7) ? 1 : 2;

        // Debugging: Log each expense and its label
        console.log('Expense:', expense, 'Label:', label);

        return {
            features: [
                parseFloat(expense?.amount ?? 0) / maxAmount,
                date?.getMonth() / 11,
                date?.getDate() / 31,
                categories.indexOf(expense?.category) / categories?.length,
                parseFloat(expense?.amount ?? 0) / (budget?.monthly?.[expense?.category] ?? 1),
                Object.values(budget?.monthly ?? {}).reduce((a, b) => a + parseFloat(b ?? 0), 0) / 1000000
            ],
            label: label
        };
    });
}, [expenses, budget]);


    // Train model and generate insights
    const analyzeWithAI = useCallback(async () => {
        if (!model || !expenses?.length || !budget) return;
    
        const preparedData = prepareData();
        if (!preparedData) return;
    
        // Debugging: Log preparedData and labels
        console.log('Prepared Data:', preparedData);
        const labelValues = preparedData.map(d => d?.label ?? 0);
        console.log('Label Values:', labelValues);
    
        // Validate label values
        if (!labelValues.every(value => [0, 1, 2].includes(value))) {
            console.error('Invalid label values detected:', labelValues);
            return;
        }
    
        const features = tf.tensor2d(preparedData.map(d => d?.features ?? []));
        const labels = tf.oneHot(tf.tensor1d(labelValues, 'int32'), 3);
    
        await model.fit(features, labels, {
            epochs: 100,
            batchSize: 32,
            validationSplit: 0.2,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    setTrainingProgress((epoch + 1) / 100);
                    console.log(`Epoch ${epoch + 1}: Loss - ${logs?.loss?.toFixed(4)}, Acc - ${logs?.acc?.toFixed(4)}`);
                }
            }
        });
    
        // Generate predictions
        const predictions = model.predict(features);
        const predictionData = await predictions.array();
    
        // Create insights
        const categoryAnalysis = {};
        preparedData.forEach((_, index) => {
            const category = expenses?.[index]?.category;
            if (!categoryAnalysis?.[category]) {
                categoryAnalysis[category] = {
                    total: 0,
                    over: 0,
                    count: 0
                };
            }
            categoryAnalysis[category].total += expenses?.[index]?.amount ?? 0;
            categoryAnalysis[category].over += predictionData?.[index]?.[0] ?? 0;
            categoryAnalysis[category].count++;
        });
    
        const insights = Object.entries(categoryAnalysis).map(([category, data]) => {
            const risk = (data?.over / data?.count) * 100;
            const avgSpend = data?.total / data?.count;
            const budgetLimit = budget?.monthly?.[category] ?? 0;
            
            return `• ${category}: ${risk?.toFixed(1)}% overspend risk
       Avg: $${avgSpend?.toFixed(2)} vs Budget: $${budgetLimit}
       ${risk > 50 ? '⚠️ Consider reducing expenses' : '✅ Within safe limits'}`;
        }).join('\n\n');
    
        setAiInsights(`AI-Powered Budget Analysis:\n\n${insights}`);
        tf.dispose([features, labels, predictions]);
    
    }, [model, expenses, budget, prepareData]);



    // Budget comparison logic
    const checkBudget = useCallback(() => {
        if (!budget) return;

        const newAlerts = [];
        const monthlySpending = expenses.reduce((acc, expense) => {
            acc[expense?.category] = (acc[expense?.category] ?? 0) + parseFloat(expense?.amount ?? 0);
            return acc;
        }, {});

        Object.entries(monthlySpending).forEach(([category, amount]) => {
            const budgetLimit = budget?.monthly?.[category];
            if (budgetLimit && amount > budgetLimit) {
                newAlerts.push(`Overspent ${category}: $${amount} vs $${budgetLimit}`);
            }
        });

        setAlerts(newAlerts);
    }, [expenses, budget]);

    useEffect(() => {
        if (!loading && model && expenses?.length && budget) {
            analyzeWithAI();
            checkBudget();
        }
    }, [loading, model, expenses, budget, analyzeWithAI, checkBudget]);

    // Chart configuration
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];
    const processCategoryData = () => {
        return expenses.reduce((acc, expense) => {
            acc[expense?.category] = (acc[expense?.category] ?? 0) + parseFloat(expense?.amount ?? 0);
            return acc;
        }, {});
    };

    if (loading) {
        return <div className="p-4 ml-20">Loading financial insights...</div>;
    }

    return (
        <div className="p-4 ml-20">
            {/* AI Insights Section */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-bold mb-4">🤖 AI Budget Analysis</h2>
                <div className="bg-white p-4 rounded-md whitespace-pre-line">
                    {trainingProgress < 1 ? (
                        <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${trainingProgress * 100}%` }}
                                ></div>
                            </div>
                            <span className="ml-2">{(trainingProgress * 100)?.toFixed(0)}%</span>
                        </div>
                    ) : (
                        aiInsights || "Analyzing spending patterns..."
                    )}
                </div>
            </div>

            {/* Alerts Section */}
            {alerts?.length > 0 && (
                <div className="mb-8 p-4 bg-red-50 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">🚨 Budget Alerts</h3>
                    {alerts.map((alert, i) => (
                        <p key={i} className="text-red-600">• {alert}</p>
                    ))}
                </div>
            )}

            {/* Visualization Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">📊 Financial Overview</h2>
                
                {/* Pie Chart */}
                <div className="mb-8 p-4 bg-white rounded-lg">
                    <h3 className="font-semibold mb-2">Spending Distribution</h3>
                    <PieChart width={600} height={400}>
                        <Pie
                            data={Object.entries(processCategoryData()).map(([name, value]) => ({ name, value }))}
                            dataKey="value"
                            nameKey="name"
                            label
                        >
                            {Object.entries(processCategoryData()).map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value?.toFixed(2)}`} />
                        <Legend />
                    </PieChart>
                </div>

                {/* Bar Chart */}
                <div className="mb-8 p-4 bg-white rounded-lg">
                    <h3 className="font-semibold mb-2">Monthly Spending Trends</h3>
                    <BarChart width={800} height={400} data={expenses}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="dateTime" 
                            tickFormatter={(str) => new Date(str)?.toLocaleDateString()}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="amount" fill="#8884d8" />
                    </BarChart>
                </div>

                {/* Budget Progress */}
                <div className="p-4 bg-white rounded-lg">
                    <h3 className="font-semibold mb-2">Budget vs Actual</h3>
                    <LineChart width={800} height={400} data={expenses}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="dateTime" 
                            tickFormatter={(str) => new Date(str)?.toLocaleDateString()}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#8884d8" 
                            name="Actual Spending"
                        />
                        {budget && Object.keys(budget?.monthly ?? {}).map((category, index) => (
                            <Line
                                key={category}
                                type="monotone"
                                dataKey={() => budget?.monthly?.[category]}
                                stroke={COLORS[(index + 1) % COLORS.length]}
                                strokeDasharray="5 5"
                                name={`${category} Budget`}
                            />
                        ))}
                    </LineChart>
                </div>
            </div>

            {/* Budget Controls */}
            <div className="flex gap-4 mt-8">
                <button
                    onClick={() => window.location.href = '/my-budget'}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Adjust Budget
                </button>
                <button
                    onClick={analyzeWithAI}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                    Refresh Analysis
                </button>
            </div>
        </div>
    );
};

export default ExpenseInsights;