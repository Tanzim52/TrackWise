import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:5000/reviews")
            .then(res => setReviews(res.data))
            .catch(err => console.error("Error fetching reviews:", err));
    }, []);

    const nextReview = () => setIndex((prev) => (prev + 2) % reviews.length);
    const prevReview = () => setIndex((prev) => (prev - 2 + reviews.length) % reviews.length);

    return (
        <div className="p-5 flex flex-col items-center gap-5 relative w-full max-w-6xl mx-auto">
            {/* Title & Subtitle */}
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center">
                User Reviews
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center mb-4">
                See what our users have to say about us
            </p>

            {/* Review Card Slider */}
            <div className="relative w-full flex justify-between items-center">
                {/* Left Button */}
                <button 
                    onClick={prevReview} 
                    className="absolute left-4 sm:left-6  text-[#674d26] p-3 rounded-full hover:text-gray-600  transition z-10">
                    <FaChevronLeft size={24} />
                </button>

                {/* Animated Review Cards Container */}
                <div className="w-full flex overflow-hidden justify-center">
                    <AnimatePresence mode="wait">
                        {reviews.length > 1 && (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2  w-full px-4"
                            >
                                {[0, 1].map((offset) => {
                                    const reviewIndex = (index + offset) % reviews.length;
                                    return (
                                        <div key={reviews[reviewIndex]?._id} className="border p-4 rounded-lg shadow-lg bg-white text-center w-full max-w-sm mx-auto">
                                            <div className="flex flex-col items-center">
                                                <img
                                                    src={reviews[reviewIndex]?.photoURL}
                                                    alt={reviews[reviewIndex]?.displayName}
                                                    className="w-20 h-20 rounded-full object-cover mb-3"
                                                />
                                                <h3 className="font-semibold text-lg">{reviews[reviewIndex]?.displayName}</h3>
                                            </div>
                                            <p className="text-gray-600 mt-2 text-sm max-h-20 overflow-y-auto break-words">
                                                {reviews[reviewIndex]?.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Button */}
                <button 
                    onClick={nextReview} 
                    className="absolute right-4 sm:right-6  text-[#674d26] p-3 rounded-full hover:text-gray-600 transition z-10">
                    <FaChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default Reviews;
