import { useState, useEffect } from 'react';
import axios from 'axios';

const COLORS = ['#4c1a36', '#dfab81', '#395c6b', '#7a9e7e', '#f4e3b1', '#a85751'];
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY; // Store in .env file

const AIFeedbacks = ({ insights, budget }) => {
  const [feedbacks, setFeedbacks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enhanced mock data with realistic examples
  const mockFeedback = {
    Food: {
      positive: "Maintained 75% of grocery budget",
      improvement: "Reduce weekend dining expenses",
      suggestion: "Meal prep 5 days/week to save ৳500 weekly"
    },
    Transport: {
      positive: "Stayed within fuel budget for 3 months",
      improvement: "Optimize commute routes",
      suggestion: "Use public transport 3 days/week"
    },
    Health: {
      positive: "Consistent medical budget allocation",
      improvement: "Compare pharmacy prices",
      suggestion: "Consider generic medication alternatives"
    },
    Savings: {
      positive: "Achieved 90% savings target",
      improvement: "Increase monthly contribution",
      suggestion: "Automate 15% salary deduction"
    },
    // Add more mock data for other categories...
  };

  const generateAIFeedback = async (category, data) => {
    // Use mock data in development
    if (import.meta.env.MODE === 'development') {
      return mockFeedback[category] || getFallbackFeedback(category, data);
    }

    try {
      const prompt = `As financial expert, analyze ${category} spending:
- Budget: ৳${data.budget.toFixed(2)}
- Spent: ৳${data.total.toFixed(2)} (${((data.total/data.budget)*100).toFixed(1)}%)
- Transactions: ${data.transactions.length}

Provide specific feedback in EXACT format:
Positive: [actual achievement]
Improvement: [clear focus area]
Suggestion: [actionable advice]`;

      const response = await axios.post(
        'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
        { inputs: prompt },
        { 
          headers: { Authorization: `Bearer ${HF_API_KEY}` },
          timeout: 15000 
        }
      );

      return parseAIResponse(response.data[0]?.generated_text || '');
    } catch (error) {
      console.error('AI feedback error:', error);
      return getFallbackFeedback(category, data);
    }
  };

  const parseAIResponse = (text) => {
    const cleanText = text.replace(/[\*\-]/g, '').replace(/\[.*?\]/g, '');
    const sections = cleanText.split('\n').filter(l => l.trim());
    
    return {
      positive: sections.find(l => l.toLowerCase().includes('positive:'))?.split(':')[1]?.trim().slice(0, 60) || 'Good budget adherence',
      improvement: sections.find(l => l.toLowerCase().includes('improvement:'))?.split(':')[1]?.trim().slice(0, 60) || 'Potential cost optimization',
      suggestion: sections.find(l => l.toLowerCase().includes('suggestion:'))?.split(':')[1]?.trim().slice(0, 70) || 'Review weekly expenses'
    };
  };

  const getFallbackFeedback = (category, data) => {
    const spentPercent = (data.total / data.budget) * 100;
    
    return {
      positive: spentPercent < 90 
        ? `Maintained ${(100 - spentPercent).toFixed(0)}% budget headroom` 
        : 'Consistent spending pattern',
      improvement: spentPercent > 90
        ? `Reduce expenses by ${(spentPercent - 90).toFixed(0)}%`
        : 'Monitor discretionary purchases',
      suggestion: spentPercent > 100
        ? 'Implement immediate spending freeze'
        : 'Continue current budget strategy'
    };
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!insights || Object.keys(insights).length === 0) {
          throw new Error('No spending data available');
        }

        const feedbackPromises = Object.entries(insights).map(
          async ([category, data]) => ({
            category,
            ...(await generateAIFeedback(category, data))
          })
        );

        const results = await Promise.all(feedbackPromises);
        const newFeedbacks = results.reduce((acc, { category, ...rest }) => 
          ({ ...acc, [category]: rest }), {});

        setFeedbacks(newFeedbacks);
      } catch (err) {
        setError(err.message || 'Failed to generate insights');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [insights]);

  return (
    <div className="bg-[#fefdec] p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#4c1a36] mb-8">AI Spending Analysis</h2>
        
        {error && (
          <div className="alert alert-error mb-8 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <span className="loading loading-dots loading-lg text-[#4c1a36]"></span>
            <p className="mt-4 text-[#4c1a36] font-medium">Analyzing spending patterns...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(feedbacks).map(([category, feedback], index) => {
              const spentPercent = (insights[category].total / insights[category].budget) * 100;
              const categoryColor = COLORS[index % COLORS.length];

              return (
                <div 
                  key={category}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#f4e3b1]"
                >
                  {/* Header Section */}
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center shadow-md"
                      style={{ 
                        backgroundColor: `${categoryColor}20`,
                        border: `2px solid ${categoryColor}`
                      }}
                    >
                      <span 
                        className="text-2xl font-bold"
                        style={{ color: categoryColor }}
                      >
                        {category[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#4c1a36]">{category}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-[#395c6b]">
                          Spent: ৳{insights[category].total.toFixed(2)}
                        </span>
                        <span className={`badge badge-sm ${spentPercent > 100 ? 'badge-error' : 'badge-success'}`}>
                          {spentPercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Sections */}
                  <div className="space-y-4">
                    {/* Positive Feedback */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600">✓</span>
                        </div>
                        <h4 className="font-semibold text-green-800">Positive Note</h4>
                      </div>
                      <p className="text-sm text-green-700">
                        {feedback.positive}
                      </p>
                    </div>

                    {/* Improvement Feedback */}
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-yellow-600">!</span>
                        </div>
                        <h4 className="font-semibold text-yellow-800">Improvement Area</h4>
                      </div>
                      <p className="text-sm text-yellow-700">
                        {feedback.improvement}
                      </p>
                    </div>

                    {/* Suggestion Feedback */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600">💡</span>
                        </div>
                        <h4 className="font-semibold text-blue-800">Smart Suggestion</h4>
                      </div>
                      <p className="text-sm text-blue-700">
                        {feedback.suggestion}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFeedbacks;