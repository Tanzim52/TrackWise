import { useForm } from "react-hook-form";
import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaTag, FaCalendarAlt, FaStickyNote } from "react-icons/fa";
import axios from "axios";
import "animate.css";
import { AuthContext } from "../../../AuthProvider/AuthProvider";

const AddExpense = () => {
  const { user } = useContext(AuthContext);
  console.log(user?.email);
  const { register, handleSubmit, reset } = useForm();
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      setCurrentDateTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data) => {
    // Add user's email to the expense data along with other form data
    const expenseData = { ...data, dateTime: currentDateTime, email: user?.email };

    try {
      const response = await axios.post("http://localhost:5000/expenses", expenseData);
      console.log("Expense added:", response.data);
      reset();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-[#fefdec] p-6"
    >
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-lg border border-[#dfab81]">
        <h2 className="text-3xl font-bold text-center text-[#4c1a36] animate__animated animate__fadeInDown">
          💰 Add Expense
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          {/* Amount */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <FaMoneyBillWave className="absolute left-3 top-3 text-[#4c1a36]" />
            <input
              type="number"
              {...register("amount", { required: true })}
              placeholder="Amount (৳)"
              className="w-full pl-10 py-2 border border-[#dfab81] rounded-md focus:ring-2 focus:ring-[#4c1a36] text-[#4c1a36] placeholder-[#4c1a36] bg-[#fefdec]"
            />
          </motion.div>

          {/* Category */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <FaTag className="absolute left-3 top-3 text-[#4c1a36]" />
            <select
              {...register("category", { required: true })}
              className="w-full pl-10 py-2 border border-[#dfab81] rounded-md focus:ring-2 focus:ring-[#4c1a36] text-[#4c1a36] bg-[#fefdec]"
            >
              <option value="">Select Category</option>
              <option value="Food">🍔 Food</option>
              <option value="Transport">🚗 Transport</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Bills">📑 Bills</option>
              <option value="Savings">💰 Savings</option>
              <option value="Other">🔖 Other</option>
            </select>
          </motion.div>

          {/* Date & Time (Read-Only) */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <FaCalendarAlt className="absolute left-3 top-3 text-[#4c1a36]" />
            <input
              type="text"
              value={currentDateTime}
              readOnly
              className="w-full pl-10 py-2 border border-[#dfab81] rounded-md bg-gray-200 text-gray-600 cursor-not-allowed"
            />
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <FaStickyNote className="absolute left-3 top-3 text-[#4c1a36]" />
            <textarea
              {...register("notes")}
              placeholder="Notes (optional)"
              className="w-full pl-10 pt-3 h-24 border border-[#dfab81] rounded-md focus:ring-2 focus:ring-[#4c1a36] text-[#4c1a36] bg-[#fefdec] resize-none"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-[#4c1a36] text-white py-2 rounded-md font-semibold hover:bg-[#dfab81] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Expense 📝
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddExpense;
