import { useEffect, useState } from "react";
import axios from "axios";

const Reviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/reviews")
            .then(res => setReviews(res.data.slice(0, 3))) // Get only the first 3 reviews
            .catch(err => console.error("Error fetching reviews:", err));
    }, []);

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold text-center mb-5">User Reviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {reviews.map((review) => (
                    <div key={review._id} className="border p-4 rounded-lg shadow-lg bg-white">
                        <div className="flex items-center gap-3">
                            <img 
                                src={review?.photoURL} 
                                alt={review.displayName} 
                                className="w-12 h-12 rounded-full object-cover" 
                            />
                            <div>
                                <h3 className="font-semibold">{review.displayName}</h3>
                                <p className="text-sm text-gray-500 break-words">{review.email}</p>
                            </div>
                        </div>
                        <h4 className="text-lg font-medium mt-3">{review.title}</h4>
                        <p className="text-gray-600 mt-2 text-sm max-h-20 overflow-y-auto break-words">
                            {review.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;
