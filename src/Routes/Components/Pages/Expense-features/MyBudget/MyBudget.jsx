import { useState, useEffect, useContext } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { FaEdit, FaSave, FaMoneyBillWave } from "react-icons/fa";
import { AuthContext } from "../../../AuthProvider/AuthProvider";
import axios from "axios";

const categories = ["Food", "Transport", "Entertainment", "Bills", "Savings", "Shopping", "Utilities", "Health", "Snacks", "Fitness", "Others"];

const defaultPercentages = {
  Food: 15, Transport: 10, Entertainment: 5, Bills: 20,
  Savings: 15, Shopping: 8, Utilities: 10, Health: 5,
  Snacks: 3, Fitness: 4, Others: 5
};

const MyBudget = () => {
  const { user } = useContext(AuthContext);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [categoryPercentages, setCategoryPercentages] = useState({ ...defaultPercentages });
  const [budgetData, setBudgetData] = useState({ daily: {}, weekly: {}, monthly: {} });
  const [editing, setEditing] = useState(false);

  useEffect(() => { AOS.init({ duration: 1000 }) }, []);
  useEffect(() => { user?.email && fetchBudget() }, [user?.email]);

  const fetchBudget = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/budget", { params: { email: user.email } });
      const userBudget = data || { daily: {}, weekly: {}, monthly: {} };
      
      if (Object.keys(userBudget.monthly).length) {
        const total = Object.values(userBudget.monthly).reduce((sum, val) => sum + Number(val), 0);
        const percentages = categories.reduce((acc, cat) => ({
          ...acc,
          [cat]: parseFloat(((userBudget.monthly[cat] / total) * 100).toFixed(2))
        }), {});
        setCategoryPercentages(percentages);
        setMonthlyTotal(total);
      }
      
      setBudgetData(userBudget);
    } catch (error) { console.error("Error fetching budget:", error) }
  };

  const balancePercentages = (changedCategory, newValue) => {
    const oldValue = categoryPercentages[changedCategory];
    const delta = newValue - oldValue;
    if (delta === 0) return { ...categoryPercentages };

    const newPercentages = { ...categoryPercentages, [changedCategory]: newValue };
    const otherCategories = categories.filter(cat => cat !== changedCategory);
    const totalOthers = otherCategories.reduce((sum, cat) => sum + newPercentages[cat], 0);
    const remainingTotal = 100 - newValue;

    if (totalOthers === 0) {
      otherCategories.forEach(cat => { newPercentages[cat] = 0 });
    } else {
      const scaleFactor = remainingTotal / totalOthers;
      otherCategories.forEach(cat => {
        newPercentages[cat] = parseFloat((newPercentages[cat] * scaleFactor).toFixed(2));
      });
    }

    // Fix rounding errors
    const currentTotal = Object.values(newPercentages).reduce((a, b) => a + b, 0);
    if (currentTotal !== 100) {
      const adjustment = 100 - currentTotal;
      const firstAdjustable = otherCategories.find(cat => newPercentages[cat] > 0);
      if (firstAdjustable) newPercentages[firstAdjustable] += adjustment;
    }

    return newPercentages;
  };

  const handlePercentageChange = (category, value) => {
    const numericValue = Math.min(100, Math.max(0, parseFloat(value) || 0));
    const balanced = balancePercentages(category, numericValue);
    setCategoryPercentages(balanced);
  };

  const handleSubmit = async () => {
    if (!user?.email) return;
    if (parseFloat(Object.values(categoryPercentages).reduce((a, b) => a + b, 0).toFixed(2) !== "100.00")) {
      alert("Total must equal 100%");
      return;
    }

    try {
      const monthlyValue = parseFloat(monthlyTotal);
      if (isNaN(monthlyValue)) {
        alert("Please enter valid monthly budget");
        return;
      }

      const budgetPayload = categories.reduce((acc, cat) => ({
        ...acc,
        monthly: { ...acc.monthly, [cat]: parseFloat((monthlyValue * categoryPercentages[cat] / 100).toFixed(2)) },
        daily: { ...acc.daily, [cat]: parseFloat((monthlyValue * categoryPercentages[cat] / 100 / 30).toFixed(2)) },
        weekly: { ...acc.weekly, [cat]: parseFloat((monthlyValue * categoryPercentages[cat] / 100 / 4.345).toFixed(2)) }
      }), { email: user.email, monthly: {}, daily: {}, weekly: {} });

      const method = Object.keys(budgetData.monthly).length ? "put" : "post";
      await axios[method]("http://localhost:5000/budget", budgetPayload);
      await fetchBudget();
      setEditing(false);
    } catch (error) { console.error("Budget update failed:", error) }
  };

  const totalPercentage = Object.values(categoryPercentages).reduce((a, b) => a + b, 0).toFixed(2);

  return (
    <div className="bg-gradient-to-r from-[#4c1a36] to-[#395c6b] min-h-screen text-white py-16 px-8 md:px-20">
      <motion.h2 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
        className="text-center text-4xl font-bold">
        💰 Smart Budget Management
      </motion.h2>

      <motion.div data-aos="fade-up" whileHover={{ scale: 1.05 }}
        className="max-w-3xl mx-auto mt-10 bg-[#fefdec] text-[#4c1a36] p-6 rounded-lg shadow-lg">
        
        <h4 className="text-2xl font-bold text-center text-[#395c6b] mb-6">Budget Distribution Overview</h4>

        {editing ? (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <label className="block text-lg font-semibold mb-2">Monthly Budget (৳)</label>
              <div className="flex items-center">
                <FaMoneyBillWave className="text-[#395c6b] text-xl mr-2" />
                <input type="number" value={monthlyTotal} onChange={(e) => setMonthlyTotal(e.target.value)}
                  className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#395c6b] text-[#4c1a36]"
                  autoFocus />
              </div>
            </div>

            {categories.map(category => (
              <div key={category} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-lg font-semibold">{category}</label>
                  <span className="text-sm text-gray-600">
                    {categoryPercentages[category].toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <input type="range" min="0" max="100" step="0.1" 
                    value={categoryPercentages[category]} 
                    onChange={(e) => handlePercentageChange(category, e.target.value)}
                    className="w-full range-slider" />
                  <input type="number" min="0" max="100" step="0.1"
                    value={categoryPercentages[category].toFixed(2)}
                    onChange={(e) => handlePercentageChange(category, e.target.value)}
                    className="w-20 p-1 text-center border rounded" />
                </div>
              </div>
            ))}

            <div className={`p-3 rounded-lg text-center ${totalPercentage === "100.00" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              Total Allocation: {totalPercentage}%
            </div>

            <button onClick={handleSubmit} disabled={totalPercentage !== "100.00"}
              className={`w-full py-3 rounded-md font-semibold transition-colors flex items-center justify-center 
                ${totalPercentage === "100.00" ? "bg-[#dfab81] hover:bg-[#4c1a36] text-white" : "bg-gray-400 cursor-not-allowed"}`}>
              <FaSave className="mr-2" /> Save Budget Plan
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center bg-white p-4 rounded-lg shadow">
              <h3 className="text-2xl font-bold text-[#4c1a36]">
                Total Monthly Budget: ৳{monthlyTotal.toFixed(2)}
              </h3>
            </div>

            {categories.map(category => (
              <motion.div key={category} whileHover={{ scale: 1.02 }} className="bg-white p-4 rounded-lg shadow">
                <h5 className="text-lg font-semibold text-[#4c1a36] mb-2">{category}</h5>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="text-sm text-gray-600">Monthly</p>
                    <p className="font-bold">৳{(budgetData.monthly[category] || 0).toFixed(2)}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="text-sm text-gray-600">Daily Limit</p>
                    <p className="font-bold">৳{(budgetData.daily[category] || 0).toFixed(2)}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="text-sm text-gray-600">Weekly Limit</p>
                    <p className="font-bold">৳{(budgetData.weekly[category] || 0).toFixed(2)}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <button onClick={() => setEditing(true)}
              className="w-full bg-[#dfab81] hover:bg-[#4c1a36] text-white py-3 rounded-md font-semibold transition-colors flex items-center justify-center">
              <FaEdit className="mr-2" /> Adjust Budget Plan
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyBudget;