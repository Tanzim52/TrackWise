import  { useState, useEffect, useContext } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "animate.css";
import { motion } from "framer-motion";
import { FaEdit, FaSave, FaMoneyBillWave } from "react-icons/fa";
import { AuthContext } from "../../../AuthProvider/AuthProvider";
import axios from "axios";

const categories = ["Food", "Transport", "Entertainment", "Bills", "Savings","Shopping","Utilities","Health","Snacks","Fitness", "Others"];

const MyBudget = () => {
  const { user } = useContext(AuthContext);
  const [budget, setBudget] = useState({ daily: {}, weekly: {}, monthly: {} });
  const [formBudget, setFormBudget] = useState({ daily: {}, weekly: {}, monthly: {} });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetchBudget();
    } else {
      console.warn("🚨 No email found, skipping budget fetch.");
    }
  }, [user?.email]);

  const fetchBudget = async () => {
    try {
      if (!user?.email) {
        console.warn("❌ Cannot fetch budget, user email is missing.");
        return;
      }

      console.log("📤 Fetching budget for email:", user.email);

      const response = await axios.get("http://localhost:5000/budget", {
        params: { email: user.email },
      });

      const userBudget = response.data || { daily: {}, weekly: {}, monthly: {} };
      console.log("✅ Budget received:", userBudget);

      setBudget(userBudget);
      setFormBudget(userBudget);
    } catch (error) {
      console.error("❌ Error fetching budget:", error);
    }
  };

  const handleInputChange = (e, type, category) => {
    setFormBudget((prev) => ({
      ...prev,
      [type]: { ...prev[type], [category]: e.target.value },
    }));
  };

  const handleSubmit = async () => {
    try {
        if (!user?.email) {
            console.error("❌ User email is missing!");
            return;
        }

        const budgetData = {
            email: user.email,
            daily: formBudget.daily,
            weekly: formBudget.weekly,
            monthly: formBudget.monthly
        };

        console.log("📤 Sending Budget Data:", budgetData);

        const response = await axios.post("http://localhost:5000/budget", budgetData);
        console.log("✅ Response from Backend:", response.data);
        
        fetchBudget();
        setEditing(false);
    } catch (error) {
        console.error("❌ Error Saving Budget:", error.response ? error.response.data : error.message);
    }
};


  return (
    <div className="bg-gradient-to-r from-[#4c1a36] to-[#395c6b] min-h-screen text-white py-16 px-8 md:px-20">
      <motion.h2
        className="text-center text-4xl font-bold animate__animated animate__fadeInUp"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        💰 Manage Your Budget Efficiently
      </motion.h2>

      <motion.div
        className="max-w-3xl mx-auto mt-10 bg-[#fefdec] text-[#4c1a36] p-6 rounded-lg shadow-lg"
        data-aos="fade-up"
        whileHover={{ scale: 1.05 }}
      >
        <h4 className="text-2xl font-bold text-center text-[#395c6b]">
          Your Budget Overview
        </h4>

        {editing ? (
          <div className="mt-6">
            {categories.map((category) => (
              <div key={category} className="mb-6">
                <label className="block text-lg font-semibold capitalize">{category} (৳)</label>
                <div className="grid grid-cols-3 gap-3">
                  {["daily", "weekly", "monthly"].map((type) => (
                    <div key={type} className="flex items-center bg-white p-2 rounded-md shadow">
                      <FaMoneyBillWave className="text-[#395c6b] text-xl mr-2" />
                      <input
                        type="number"
                        name={`${type}-${category}`}
                        value={formBudget?.[type]?.[category] || ""}
                        onChange={(e) => handleInputChange(e, type, category)}
                        required
                        className="w-full p-2 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#dfab81] text-white py-2 rounded-md font-semibold hover:bg-[#4c1a36] transition duration-300 animate__animated animate__pulse"
            >
              <FaSave className="inline-block mr-2" /> Save Budget
            </button>
          </div>
        ) : (
          <div className="mt-6">
            {categories.map((category) => (
              <motion.div
                key={category}
                className="p-4 bg-white rounded-lg shadow mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <h5 className="text-lg font-semibold capitalize text-[#4c1a36]">
                  {category}
                </h5>
                <div className="grid grid-cols-3 text-center text-[#395c6b] mt-2">
                  <div className="font-bold">Daily: ৳{budget?.daily?.[category] || 0}</div>
                  <div className="font-bold">Weekly: ৳{budget?.weekly?.[category] || 0}</div>
                  <div className="font-bold">Monthly: ৳{budget?.monthly?.[category] || 0}</div>
                </div>
              </motion.div>
            ))}
            <div className="text-center mt-6">
              <button
                onClick={() => setEditing(true)}
                className="bg-[#dfab81] hover:bg-[#4c1a36] text-white px-6 py-2 rounded-md font-semibold transition-all duration-300 animate__animated animate__pulse"
              >
                <FaEdit className="inline-block mr-2" /> Edit Budget
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyBudget;
