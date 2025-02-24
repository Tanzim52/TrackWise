import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaGoogle, FaUser, FaEnvelope, FaLock, FaImage } from "react-icons/fa";
import "animate.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const SignUp = () => {
    const { auth, googleLogin } = useContext(AuthContext);
    const { register, handleSubmit, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle Sign Up with Email & Password
    const handleFormSubmit = async (data) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            // Update user profile with name & photo URL
            await updateProfile(user, {
                displayName: data.fullName,
                photoURL: data.photoURL,
            });

            console.log("User Registered:", user);
            reset();
            navigate("/"); // Redirect after sign-up
        } catch (error) {
            console.error("Error during Sign Up:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle Google Sign-In
    const handleGoogleSignIn = async () => {
        try {
            await googleLogin();
            navigate("/"); // Redirect after Google login
        } catch (error) {
            console.error("Google Sign-In Error:", error.message);
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
                    Create an Account
                </h2>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-6">
                    {/* Full Name */}
                    <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="relative">
                        <FaUser className="absolute left-3 top-3 text-[#4c1a36]" />
                        <input type="text" {...register("fullName", { required: true })} placeholder="Full Name" className="w-full pl-10 py-2 border border-[#dfab81] rounded-md focus:ring-2 focus:ring-[#4c1a36] text-[#4c1a36] placeholder-[#4c1a36] bg-[#fefdec]" />
                    </motion.div>

                    {/* Photo URL */}
                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="relative">
                        <FaImage className="absolute left-3 top-3 text-[#4c1a36]" />
                        <input type="text" {...register("photoURL", { required: true })} placeholder="Photo URL" className="w-full pl-10 py-2 border border-[#dfab81] rounded-md focus:ring-2 focus:ring-[#4c1a36] text-[#4c1a36] placeholder-[#4c1a36] bg-[#fefdec]" />
                    </motion.div>

                    {/* Email */}
                    <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="relative">
                        <FaEnvelope className="absolute left-3 top-3 text-[#4c1a36]" />
                        <input type="email" {...register("email", { required: true })} placeholder="Email" className="w-full pl-10 py-2 border border-[#dfab81] rounded-md focus:ring-2 focus:ring-[#4c1a36] text-[#4c1a36] placeholder-[#4c1a36] bg-[#fefdec]" />
                    </motion.div>

                    {/* Password */}
                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="relative">
                        <FaLock className="absolute left-3 top-3 text-[#4c1a36]" />
                        <input type="password" {...register("password", { required: true })} placeholder="Password" className="w-full pl-10 py-2 border border-[#dfab81] rounded-md focus:ring-2 focus:ring-[#4c1a36] text-[#4c1a36] placeholder-[#4c1a36] bg-[#fefdec]" />
                    </motion.div>

                    {/* Sign Up Button */}
                    <motion.button type="submit" className="w-full bg-[#4c1a36] text-white py-2 rounded-md font-semibold hover:bg-[#dfab81] transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </motion.button>
                </form>

                {/* Google Sign In Button */}
                <motion.button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center bg-[#395c6b] text-white py-2 rounded-md font-semibold mt-4 hover:bg-[#dfab81] transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <FaGoogle className="mr-2" /> Sign Up with Google
                </motion.button>

                {/* Sign In Link */}
                <p className="text-center mt-4 text-[#395c6b]">
                    Already have an account?{" "}
                    <Link to="/signin">
                        <span className="text-[#4c1a36] font-semibold cursor-pointer hover:underline">Sign In</span>
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default SignUp;
