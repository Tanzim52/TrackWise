import React, { useEffect } from "react";
import { FaUserCheck, FaBrain, FaChartPie, FaBell, FaShieldAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "animate.css";
import Lottie from "lottie-react";
import working from "../../../../assets/Animation - 1740514237951.json"

const steps = [
    { icon: <FaUserCheck />, title: "Sign Up & Set Up", desc: "Create an account and set your financial goals." },
    { icon: <FaBrain />, title: "AI-Powered Insights", desc: "AI analyzes your spending patterns and gives suggestions." },
    { icon: <FaChartPie />, title: "Track Expenses & Budgets", desc: "Monitor your budgets with dynamic visual charts." },
    { icon: <FaBell />, title: "Smart Reminders", desc: "Get notified for upcoming bills and budget updates." },
    { icon: <FaShieldAlt />, title: "Security & Privacy", desc: "Your data remains encrypted and private." }
];

const HowItWorks = () => {
    useEffect(() => {
        AOS.init({ duration: 1200, once: true });
    }, []);

    return (
        <section className="py-20 w-10/12 mx-auto bg-[#fefdec]">
            {/* Title Section */}
            <div className="text-center mb-16 animate__animated animate__fadeInUp">
                <h2 className="text-5xl font-bold text-[#4c1a36] tracking-wide">How It Works</h2>
                <p className="text-lg text-[#395c6b] mt-4">
                    A seamless process to manage your productivity & budget effectively.
                </p>
            </div>

            {/* Steps Section - Zig-Zag Flow */}
            <div className="flex  items-center justify-center gap-10 p-4">
                <div className="">
                    <Lottie
                        animationData={working}
                        className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96"
                    />
                </div>
                <div className="relative max-w-5xl mx-auto w-full">
                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col md:flex-row items-center mb-10">
                            {/* Connector Line (Except Last Step) */}
                            {index !== steps.length - 1 && (
                                <div className="absolute left-1/2 w-1 h-16 bg-[#4c1a36] -translate-x-1/2 top-full"></div>
                            )}

                            {/* Left-Side Steps */}
                            {index % 2 === 0 ? (
                                <div className="w-full md:w-1/2 pr-8 text-right" data-aos="fade-right">
                                    <h3 className="text-2xl font-semibold text-[#4c1a36]">{step.title}</h3>
                                    <p className="text-base text-[#395c6b] mt-2">{step.desc}</p>
                                </div>
                            ) : (
                                <div className="w-full md:w-1/2"></div>
                            )}

                            {/* Circle Icon */}
                            <div className="w-16 h-16 flex items-center justify-center bg-[#4c1a36] text-white rounded-full shadow-lg text-2xl">
                                {step.icon}
                            </div>

                            {/* Right-Side Steps */}
                            {index % 2 !== 0 ? (
                                <div className="w-full md:w-1/2 pl-8" data-aos="fade-left">
                                    <h3 className="text-2xl font-semibold text-[#4c1a36]">{step.title}</h3>
                                    <p className="text-base text-[#395c6b] mt-2">{step.desc}</p>
                                </div>
                            ) : (
                                <div className="w-full md:w-1/2"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
};

export default HowItWorks;
