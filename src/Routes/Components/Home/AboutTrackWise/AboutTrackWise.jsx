import  { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "animate.css";
import { motion } from "framer-motion";
import { FaChartLine, FaBrain, FaMoneyBillWave, FaTasks, FaUserShield, FaCalendarCheck, FaMobileAlt, FaLightbulb } from "react-icons/fa";
import { Link } from "react-router-dom";

const features = [
    { icon: <FaBrain />, title: "AI-Powered Budget Insights", desc: "Smart AI helps you manage expenses and optimize your spending habits." },
    { icon: <FaChartLine />, title: "Expense Tracking Charts", desc: "Visualize your spending with dynamic charts and graphs." },
    { icon: <FaMoneyBillWave />, title: "Daily, Weekly & Monthly Budgeting", desc: "Set financial goals and track your budget effortlessly." },
    { icon: <FaTasks />, title: "Task Management", desc: "Organize and manage tasks to boost productivity." },
    { icon: <FaUserShield />, title: "Secure & Private", desc: "Your data is encrypted and protected with top-notch security." },
    { icon: <FaCalendarCheck />, title: "Smart Reminders", desc: "Never miss an important deadline or bill payment." },
    {icon: <FaLightbulb />,title: "Smart Savings Tips",desc: "Get AI-driven suggestions to save money and cut unnecessary expenses."},
    { icon: <FaMobileAlt />, title: "Responsive & Mobile Friendly", desc: "Access TrackWise on the go with a seamless experience." },
];

const TrackWiseFeatures = () => {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <div className="bg-gradient-to-b -mt-2 from-[#4c1a36] to-[#fefdec] text-white py-16 px-8 md:px-20">
            <motion.h2
                className="text-center text-4xl font-bold animate__animated animate__fadeInUp"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                Discover TrackWise: Your Ultimate Productivity Companion
            </motion.h2>

            <p className="text-center text-lg mt-4 text-[#dfab81] animate__animated animate__fadeIn animate__delay-1s">
                Empowering you to take control of your finances, productivity, and time management!
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        className="bg-[#fefdec] text-[#4c1a36] rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-500"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                        whileHover={{ scale: 1.1 }}
                    >
                        <div className="text-5xl text-[#395c6b] flex justify-center">{feature.icon}</div>
                        <h3 className="text-2xl font-semibold mt-4">{feature.title}</h3>
                        <p className="text-sm text-gray-700 mt-2">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Call to Action */}
            <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <Link
                    to="/dashboard"
                    className="bg-[#dfab81] hover:bg-[#4c1a36] text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 animate__animated animate__pulse animate__infinite"
                >
                    Start Using TrackWise Now
                </Link>
            </motion.div>
        </div>
    );
};

export default TrackWiseFeatures;
