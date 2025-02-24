import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../AuthProvider/AuthProvider";
// import { auth } from "../Firebase/firebase.init";
import "animate.css";

const SignIn = () => {
  const { googleLogin } = useContext(AuthContext); // Get Google login from context
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle Email/Password Sign In
  const handleSignIn = async (data) => {
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/"); // Redirect after successful login
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }

    setLoading(false);
    reset();
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      await googleLogin(); // Using the function from AuthContext
      navigate("/");
    } catch (err) {
      setError("Google Sign-In failed. Try again.");
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
          🔐 Sign In
        </h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4 mt-6">
          {/* Email */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <FaEnvelope className="absolute left-3 top-3 text-[#4c1a36]" />
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Email"
              className="w-full pl-10 py-2 border border-[#dfab81] rounded-md focus:ring-2 focus:ring-[#4c1a36] text-[#4c1a36] placeholder-[#4c1a36] bg-[#fefdec]"
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <FaLock className="absolute left-3 top-3 text-[#4c1a36]" />
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Password"
              className="w-full pl-10 py-2 border border-[#dfab81] rounded-md focus:ring-2 focus:ring-[#4c1a36] text-[#4c1a36] placeholder-[#4c1a36] bg-[#fefdec]"
            />
          </motion.div>

          {/* Sign In Button */}
          <motion.button
            type="submit"
            className="w-full bg-[#4c1a36] text-white py-2 rounded-md font-semibold hover:bg-[#dfab81] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In 🔓"}
          </motion.button>
        </form>

        {/* Google Sign In Button */}
        <motion.button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-[#395c6b] text-white py-2 rounded-md font-semibold mt-4 hover:bg-[#4c1a36] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaGoogle className="mr-2" /> Sign In with Google
        </motion.button>

        {/* Sign Up Link */}
        <p className="text-center mt-4 text-[#395c6b]">
          New to TrackWise?{" "}
          <Link to="/signup" className="text-[#4c1a36] font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignIn;
