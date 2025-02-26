import { useState, useContext } from "react";
import reviewLottie from '../../../../../../assets/review lottie - 1740521472195.json'


import axios from "axios";
// import { AuthContext } from "../context/AuthProvider"; // Adjust based on your auth setup
import { toast } from "react-toastify";
import { AuthContext } from "../../../../AuthProvider/AuthProvider";
import { div } from "@tensorflow/tfjs";
import Lottie from "lottie-react";

const ReviewForm = () => {
    const { user } = useContext(AuthContext); // Getting user info from AuthContext
    const [review, setReview] = useState({
        title: "",
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            return toast.error("You must be logged in to submit a review!");
        }

        const reviewData = {
            ...review,
            email: user?.email,
            displayName: user?.displayName,
            photoURL: user?.photoURL,
            date: new Date().toISOString(),
        };

        try {
            const response = await axios.post("http://localhost:5000/reviews", reviewData);
            if (response.data.insertedId) {
                toast.success("Review submitted successfully!");
                setReview({ title: "", description: "" });
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Failed to submit review. Try again later.");
        }
    };

    return (



        <div className="md:flex justify-center items-center gap-10 py-20">
            <div>
                <Lottie animationData={reviewLottie} className="w-md" />
            </div>

            <div className="max-w-lg mx-auto p-6 bg-white shadow-xl rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Give Us a Review</h2>



                <form onSubmit={handleSubmit} className="space-y-4 p-10">
                    {/* <input
          type="text"
          name="title"
          placeholder="Review Title"
          value={review.title}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        /> */}
                    <textarea
                        name="description"
                        placeholder="Your Review"
                        value={review.description}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-lg"
                        rows="4"
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewForm;
