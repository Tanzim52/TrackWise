import { useState, useEffect } from 'react';
import axios from 'axios';

const HF_API_KEY = import.meta.env.REACT_APP_HF_API_KEY;

const COLORS = ['#4c1a36', '#dfab81', '#395c6b', '#7a9e7e', '#f4e3b1', '#a85751'];

const AIFeedbacks = ({ insights, budget }) => {
  const [feedbacks, setFeedbacks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateAIFeedback = async (category, data) => {
    // Temporary mock data for development
    const mockFeedback = {
      Food: {
        positive: "Effective grocery budgeting",
        improvement: "Reduce dining out frequency",
        suggestion: "Meal prep 4 days/week"
      },
      Transport: {
        positive: "Within fuel budget limit",
        improvement: "Optimize commute routes",
        suggestion: "Carpool 2 days/week"
      },
      Savings: {
        positive: "Consistent savings habit",
        improvement: "Increase monthly contribution",
        suggestion: "Automate 10% salary deduction"
      }
    };

    if (import.meta.env.NODE_ENV === 'development') {
      return mockFeedback[category] || getFallbackFeedback(category, data);
    }

    try {
      const prompt = `As financial expert, analyze ${category} spending:
- Budget: ৳${data.budget.toFixed(2)}
- Spent: ৳${data.total.toFixed(2)} (${((data.total/data.budget)*100).toFixed(1)}%)
- Transactions: ${data.transactions.length}
- Risk: ${(data.risk/data.transactions.length).toFixed(1)}%

Respond EXACTLY in this format:
Positive: [specific achievement]
Improvement: [key area]
Suggestion: [actionable tip]`;

      const response = await axios.post(
        'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
        { inputs: prompt },
        { 
          headers: { Authorization: `Bearer ${HF_API_KEY}` },
          timeout: 20000
        }
      );

      return parseResponse(response.data[0]?.generated_text || '');
    } catch (error) {
      console.error('AI feedback error:', error);
      return getFallbackFeedback(category, data);
    }
  };

  const parseResponse = (text) => {
    const sections = text.split('\n').filter(l => l.trim());
    return {
      positive: sections.find(l => l.startsWith('Positive:'))?.replace('Positive:', '').trim() || 'Good budget adherence',
      improvement: sections.find(l => l.startsWith('Improvement:'))?.replace('Improvement:', '').trim() || 'Potential cost optimization',
      suggestion: sections.find(l => l.startsWith('Suggestion:'))?.replace('Suggestion:', '').trim() || 'Review weekly expenses'
    };
  };

  const getFallbackFeedback = (category, data) => {
    const spentRatio = (data.total / data.budget) * 100;
    return {
      positive: spentRatio < 80 ? `Maintained ${(100 - spentRatio).toFixed(0)}% budget headroom` : 'Consistent spending pattern',
      improvement: spentRatio > 80 ? `Reduce expenses by ${(spentRatio - 80).toFixed(0)}%` : 'Monitor discretionary spending',
      suggestion: spentRatio > 100 ? 'Implement spending freeze' : 'Continue current budget plan'
    };
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!insights || Object.keys(insights).length === 0) {
          throw new Error('Loading...');
        }

        const feedbackPromises = Object.entries(insights).map(
          async ([category, data]) => ({
            category,
            ...(await generateAIFeedback(category, data))
          })
        );

        const results = await Promise.all(feedbackPromises);
        const newFeedbacks = results.reduce((acc, { category, ...feedback }) => {
          acc[category] = feedback;
          return acc;
        }, {});

        setFeedbacks(newFeedbacks);
      } catch (err) {
        setError(err.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [insights]);

  return (
    <div className="bg-[#fefdec] p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#4c1a36] mb-8">Smart Spending Analysis</h2>
        
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
            <p className="mt-4 text-[#4c1a36] font-medium">Analyzing your spending patterns...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(feedbacks).map(([category, feedback], index) => {
              const categoryColor = COLORS[index % COLORS.length];
              const spentPercent = (insights[category].total / insights[category].budget) * 100;

              return (
                <div 
                  key={category} 
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#f4e3b1]"
                >
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
                        <span 
                          className={`badge badge-sm ${spentPercent > 100 ? 'badge-error' : 'badge-success'}`}
                        >
                          {spentPercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
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