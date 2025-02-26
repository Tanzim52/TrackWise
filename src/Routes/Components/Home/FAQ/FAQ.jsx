import  { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";

const faqData = [
  {
    question: "What is TrackWise?",
    answer: "TrackWise is an AI-powered productivity and budget management app that helps users optimize their time and finances effectively."
  },
  {
    question: "Is my data secure?",
    answer: "Yes! We use industry-standard encryption to ensure your personal and financial data is safe."
  },
  {
    question: "How does AI improve my budgeting?",
    answer: "Our AI analyzes your spending patterns and provides smart insights to help you save money and stay on track."
  },
  {
    question: "Can I get alerts for due dates and overspending?",
    answer: "Absolutely! TrackWise sends you notifications for tasks you set reminder on."
  },
  {
    question: "Is TrackWise free to use?",
    answer: "Yes, TrackWise is a totally free of cost platform designed just for students needs."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 w-full bg-[#fefdec]">
      {/* Title Section */}
      <div className="text-center mb-10">
        <h2 className="text-5xl font-bold text-[#4c1a36] tracking-wide">FAQs</h2>
        <p className="text-lg text-[#395c6b] mt-3">Find answers to common questions about TrackWise.</p>
      </div>

      {/* FAQ Container */}
      <div className="w-9/12 mx-auto space-y-4">
        {faqData.map((faq, index) => (
          <motion.div
            key={index}
            className="bg-[#dfab81] rounded-lg p-5 shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <button
              className="w-full flex items-center justify-between text-left text-[#4c1a36] font-semibold text-xl"
              onClick={() => toggleFAQ(index)}
            >
              <span className="flex items-center gap-2">
                <FaQuestionCircle className="text-[#4c1a36]" />
                {faq.question}
              </span>
              {openIndex === index ? (
                <FaChevronUp className="text-[#4c1a36]" />
              ) : (
                <FaChevronDown className="text-[#4c1a36]" />
              )}
            </button>

            {openIndex === index && (
              <motion.p
                className="mt-3 text-[#395c6b] "
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                {faq.answer}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
