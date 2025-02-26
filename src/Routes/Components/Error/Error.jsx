import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Error = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#fefdec] text-[#4c1a36]">
            {/* Animated 404 Text */}
            <motion.h1
                className="text-9xl font-extrabold"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                404
            </motion.h1>

            <p className="text-lg md:text-2xl mb-3 font-semibold text-[#dfab81] mt-2">
                Oops! Page not found. Looks like you're lost.
            </p>

            {/* Cool SVG Illustration */}
            

            {/* Home Button */}
            <Link to="/">
                <motion.button
                    className="bg-[#4c1a36] text-[#fefdec] px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-[#dfab81] hover:text-[#4c1a36] transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    Go To Home
                </motion.button>
            </Link>
        </div>
    );
};

export default Error;
