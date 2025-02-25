import { useState, useEffect, useCallback, useContext } from 'react';
import * as tf from '@tensorflow/tfjs';
import { 
  PieChart, Pie, LineChart, Line, RadarChart, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, 
  ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { AuthContext } from '../../../AuthProvider/AuthProvider';
import axios from 'axios';
import AIFeedbacks from './AIFeedback/AIFeedbacks';

const COLORS = ['#4c1a36', '#dfab81', '#395c6b', '#7a9e7e', '#f4e3b1', '#a85751'];

const ExpenseInsights = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [insights, setInsights] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trainingProgress, setTrainingProgress] = useState(0);

  // Enhanced TensorFlow Model
  const createModel = useCallback(() => {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [7],
          units: 128,
          activation: 'relu',
          kernelInitializer: 'heNormal'
        }),
        tf.layers.dropout({ rate: 0.4 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 3, activation: 'softmax' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.0005),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }, []);

  // Fetch data with error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, budgetRes] = await Promise.all([
          axios.get('http://localhost:5000/expenses', { params: { email: user?.email } }),
          axios.get('http://localhost:5000/budget', { params: { email: user?.email } })
        ]);
        
        setExpenses(expensesRes.data);
        setBudget(budgetRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Data fetch error:', error);
        setLoading(false);
      }
    };

    user?.email && fetchData();
  }, [user?.email]);

  // Fixed data preparation
  const prepareData = useCallback(() => {
    if (!expenses.length || !budget) return null;

    const monthlyTotal = Object.values(budget.monthly).reduce((a, b) => a + b, 0);
    const maxAmount = Math.max(...expenses.map(e => parseFloat(e.amount)), 1);

    return expenses.map(expense => {
      const budgetLimit = budget.monthly[expense.category] || 1;
      const spendingRatio = parseFloat(expense.amount) / budgetLimit;
      const expenseDate = new Date(expense.dateTime);
      
      return {
        features: [
          spendingRatio,
          (expenseDate.getDate() / 31) * 2 - 1,
          Math.cos((expenseDate.getMonth() * 2 * Math.PI) / 12),
          parseFloat(expense.amount) / monthlyTotal,
          Object.keys(budget.monthly).indexOf(expense.category) / Object.keys(budget.monthly).length,
          (budget.monthlyTotal || 0) / 100000,
          Math.log10(parseFloat(expense.amount) + 1)
        ],
        label: spendingRatio > 1 ? 0 : spendingRatio > 0.8 ? 1 : 2
      };
    });
  }, [expenses, budget]);

  // Fixed TensorFlow analysis
  const analyzeSpending = useCallback(async () => {
    if (!model) return;

    const trainingData = prepareData();
    if (!trainingData || trainingData.length < 10) {
      console.warn('Insufficient data for analysis');
      return;
    }

    const features = tf.tensor2d(trainingData.map(d => d.features));
    const labels = tf.oneHot(
      tf.tensor1d(trainingData.map(d => d.label), 'int32'),
      3
    );

    await model.fit(features, labels, {
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.25,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          setTrainingProgress((epoch + 1) / 100);
          tf.nextFrame();
        }
      }
    });

    const predictions = model.predict(features);
    const predData = await predictions.array();

    const analysis = expenses.reduce((acc, expense, index) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = {
          total: 0,
          budget: budget.monthly[category] || 0,
          risk: 0,
          transactions: [],
          predictionHistory: []
        };
      }

      acc[category].total += parseFloat(expense.amount);
      acc[category].risk += predData[index][0];
      acc[category].transactions.push(expense);
      acc[category].predictionHistory.push(predData[index][0]);
      
      return acc;
    }, {});

    const newAlerts = Object.entries(analysis)
      .filter(([_, data]) => (data.risk / data.transactions.length) > 0.5)
      .map(([category, data]) => ({
        category,
        severity: (data.risk / data.transactions.length) * 100,
        message: `${category} exceeding ${((data.total / data.budget) * 100).toFixed(1)}% of budget`
      }));

    setAlerts(newAlerts);
    setInsights(analysis);
    tf.dispose([features, labels, predictions]);
  }, [model, expenses, budget, prepareData]);

  useEffect(() => {
    if (!loading && !model) setModel(createModel());
  }, [loading, createModel, model]);

  useEffect(() => {
    if (model && !loading) analyzeSpending();
  }, [model, loading, analyzeSpending]);

  // Visualization helpers
  const processChartData = () => {
    return Object.entries(insights).map(([category, data]) => ({
      category,
      spent: data.total,
      budget: data.budget,
      risk: (data.risk / data.transactions.length) * 100
    }));
  };

  const getCategoryAdvice = (categoryData) => {
    const spentPercent = (categoryData.total / categoryData.budget) * 100;
    if (spentPercent > 100) return 'Immediate spending freeze needed';
    if (spentPercent > 75) return 'Consider reducing expenses';
    if (spentPercent > 50) return 'Monitor spending closely';
    return 'Within safe limits';
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fefdec] flex items-center justify-center">
      <div className="text-4xl text-[#4c1a36]">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fefdec] p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-[#4c1a36] mb-8">
          🧠 AI-Powered Financial Insights
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-4">
  {/* Risk Radar Chart */}
  <div className="p-8 rounded-3xl bg-gradient-to-br from-[#fff9f0] to-[#fcefe1] shadow-2xl border-2 border-white/50">
    <h2 className="text-3xl font-extrabold text-[#4c1a36] mb-8 flex items-center gap-3">
      <span className="bg-gradient-to-r from-[#4c1a36] to-[#a85751] text-white px-6 py-3 rounded-full shadow-lg">
        Risk Analysis Matrix
      </span>
    </h2>
    <ResponsiveContainer width="100%" height={500}>
      <RadarChart data={processChartData()}>
        <PolarGrid 
          stroke="#dfab81" 
          strokeWidth={1} 
          strokeDasharray="3 3"
          radialLines={false}
        />
        <PolarAngleAxis 
          dataKey="category" 
          tick={{ 
            fill: '#4c1a36', 
            fontSize: 14, 
            fontWeight: 700,
            textShadow: '1px 1px 2px rgba(255,255,255,0.5)'
          }}
        />
        <PolarRadiusAxis 
          angle={45}
          domain={[0, 100]}
          tick={{ 
            fill: '#7a9e7e', 
            fontSize: 12,
            fontWeight: 600 
          }}
        />
        <Radar
          name="Risk Level"
          dataKey="risk"
          stroke="#4c1a36"
          strokeWidth={3}
          fill="url(#radarFill)"
          fillOpacity={0.85}
          dot={{
            fill: '#ffffff',
            stroke: '#4c1a36',
            strokeWidth: 2,
            r: 5
          }}
        />
        <Tooltip
          content={({ payload }) => (
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border-2 border-[#dfab81]/30">
              <p className="font-bold text-lg text-[#4c1a36]">
                {payload[0]?.payload?.category}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center">
                  <span className="text-sm font-semibold">Risk:</span>
                  <span className="ml-2 text-[#a85751] font-bold">
                    {payload[0]?.value}%
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold">Spent:</span>
                  <span className="ml-2 text-[#395c6b] font-bold">
                    ৳{payload[0]?.payload?.spent?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        />
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#dfab81" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#a85751" stopOpacity={0.6} />
          </radialGradient>
        </defs>
      </RadarChart>
    </ResponsiveContainer>
  </div>

  {/* Spending Pie Chart */}
  <div className="p-8 rounded-3xl bg-gradient-to-br from-[#fff9f0] to-[#fcefe1] shadow-2xl border-2 border-white/50">
    <h2 className="text-3xl font-extrabold text-[#4c1a36] mb-8 flex items-center gap-3">
      <span className="bg-gradient-to-r from-[#4c1a36] to-[#a85751] text-white px-6 py-3 rounded-full shadow-lg">
        Spending Distribution
      </span>
    </h2>
    <ResponsiveContainer width="100%" height={500}>
      <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <Pie
          data={processChartData()}
          dataKey="spent"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={150}
          paddingAngle={2}
          labelLine={false}
          label={({ 
            cx, 
            cy, 
            midAngle, 
            innerRadius, 
            outerRadius, 
            percent, 
            name 
          }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-[14px] font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
              >
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
        >
          {processChartData().map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
              stroke="#ffffff"
              strokeWidth={3}
              className="hover:opacity-90 transition-opacity cursor-pointer"
            />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          formatter={(value) => (
            <span className="text-[#4c1a36] font-semibold text-sm">
              {value}
            </span>
          )}
          iconSize={16}
          iconType="circle"
          wrapperStyle={{
            backgroundColor: 'rgba(255,255,255,0.8)',
            padding: '20px',
            borderRadius: '16px',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        />
        <Tooltip
          content={({ payload }) => (
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border-2 border-[#dfab81]/30">
              <p className="font-bold text-lg text-[#4c1a36] mb-2">
                {payload[0]?.name}
              </p>
              <div className="space-y-1">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2 shadow-sm"
                    style={{ backgroundColor: payload[0]?.color }}
                  />
                  <span className="font-medium">Amount:</span>
                  <span className="ml-2 text-[#a85751] font-bold">
                    ৳{payload[0]?.value?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2" />
                  <span className="font-medium">Budget:</span>
                  <span className="ml-2 text-[#395c6b] font-bold">
                    ৳{payload[0]?.payload?.budget?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(insights).map(([category, data], index) => (
            <div key={category} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-[#4c1a36]">{category}</h3>
                <div className="text-right">
                  <p className={`text-sm ${data.total > data.budget ? 'text-red-600' : 'text-green-600'}`}>
                    {((data.total / data.budget) * 100).toFixed(1)}% Used
                  </p>
                  <p className="text-xs text-gray-500">
                    {getCategoryAdvice(data)}
                  </p>
                </div>
              </div>
              
              <Sparklines data={data.predictionHistory} width={200} height={40}>
                <SparklinesLine 
                  color={COLORS[index % COLORS.length]} 
                  style={{ strokeWidth: 2 }}
                />
              </Sparklines>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Spent/Budget:</span>
                  <span className="font-semibold">
                    ৳{data.total.toFixed(2)} / ৳{data.budget.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Daily Average:</span>
                  <span className="font-semibold">
                    ৳{(data.total / 30).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Risk Level:</span>
                  <span className={`badge ${data.risk > 50 ? 'badge-error' : 'badge-success'}`}>
                    {(data.risk / data.transactions.length).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>







<div>
    <AIFeedbacks insights={insights} budget={budget} />
</div>













        <div className="bg-white p-6 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold text-[#4c1a36] mb-6">Spending Timeline</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={expenses.map(e => ({ ...e, date: new Date(e.dateTime).toLocaleDateString() }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#4c1a36"
                strokeWidth={2}
                dot={{ fill: '#dfab81', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExpenseInsights;