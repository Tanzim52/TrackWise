import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "animate.css";
import { motion } from "framer-motion";
import { FaEdit, FaSave, FaMoneyBillWave } from "react-icons/fa";

const categories = ["Food", "Transport", "Entertainment", "Shopping"];

const MyBudget = () => {
  const [budget, setBudget] = useState({
    daily: {},
    weekly: {},
    monthly: {},
  });

  const [formBudget, setFormBudget] = useState({
    daily: {},
    weekly: {},
    monthly: {},
  });

  const [editing, setEditing] = useState({
    daily: false,
    weekly: false,
    monthly: false,
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleInputChange = (e, type, category) => {
    setFormBudget({
      ...formBudget,
      [type]: { ...formBudget[type], [category]: e.target.value },
    });
  };

  const handleSubmit = (type) => {
    setBudget((prev) => ({ ...prev, [type]: formBudget[type] }));
    setEditing((prev) => ({ ...prev, [type]: false }));
  };

  const handleEdit = (type) => {
    setEditing((prev) => ({ ...prev, [type]: true }));
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

      <motion.div className="max-w-3xl mx-auto mt-10 space-y-8">
        {["daily", "weekly", "monthly"].map((type) => (
          <motion.div
            key={type}
            className="bg-[#fefdec] text-[#4c1a36] p-6 rounded-lg shadow-lg"
            data-aos="fade-up"
            whileHover={{ scale: 1.05 }}
          >
            <h4 className="text-xl font-bold capitalize text-center text-[#395c6b]">
              {type} Budget
            </h4>

            {editing[type] ? (
              <div className="mt-4">
                {categories.map((category) => (
                  <div key={category} className="mb-4">
                    <label className="block text-md font-medium capitalize">
                      {category} (৳)
                    </label>
                    <div className="flex items-center bg-white p-2 rounded-md shadow">
                      <FaMoneyBillWave className="text-[#395c6b] text-xl mr-2" />
                      <input
                        type="number"
                        name={`${type}-${category}`}
                        value={formBudget[type][category] || ""}
                        onChange={(e) => handleInputChange(e, type, category)}
                        required
                        className="w-full p-2 outline-none"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => handleSubmit(type)}
                  className="w-full bg-[#dfab81] text-white py-2 rounded-md font-semibold hover:bg-[#4c1a36] transition duration-300 animate__animated animate__pulse"
                >
                  <FaSave className="inline-block mr-2" /> Save {type} Budget
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {categories.map((category) => (
                  <motion.div
                    key={category}
                    className="flex justify-between items-center bg-white p-3 rounded-md shadow"
                  >
                    <span className="font-semibold capitalize">{category}:</span>
                    <span className="text-lg font-bold text-[#395c6b]">
                      ৳{budget[type][category] || 0}
                    </span>
                  </motion.div>
                ))}
                <div className="text-center mt-6">
                  <button
                    onClick={() => handleEdit(type)}
                    className="bg-[#dfab81] hover:bg-[#4c1a36] text-white px-6 py-2 rounded-md font-semibold transition-all duration-300 animate__animated animate__pulse"
                  >
                    <FaEdit className="inline-block mr-2" /> Edit {type} Budget
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MyBudget;
