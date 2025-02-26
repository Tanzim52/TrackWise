import { useState } from "react";
import emailjs from "@emailjs/browser";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import Lottie from "lottie-react";
import mail from "../../../../assets/Animation - 1740515645888.json";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",          // Added name field
        email: "",
        message: "",
    });
    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus("Sending...");

        emailjs
            .send(
                "service_st5hmid", // Replace with your EmailJS Service ID
                "template_4276vj6", // Replace with your EmailJS Template ID
                {
                    from_name: formData.name, // Name field for the template
                    from_email: formData.email, // Email field for the template
                    message: formData.message, // Message field for the template
                },
                "mWaS56Z0fHceZMYXl" // Replace with your EmailJS Public Key
            )
            .then(
                () => {
                    setStatus("Message sent successfully!");
                    setFormData({ name: "", email: "", message: "" }); // Reset all fields
                },
                (error) => {
                    setStatus("Failed to send message. Try again later.");
                    console.error("EmailJS Error:", error);
                }
            );
    };

    return (
        <div id="contact" className="flex flex-col items-center py-12 px-5 bg-gradient-to-t -mt-2 from-[#4c1a36] to-[#fefdec]">
            {/* Title and Subtitle */}
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#4c1a36]">
                    Get in Touch
                </h2>
                <p className="text-lg text-[#395c6b] mt-2">
                    Have a question or feedback? We'd love to hear from you!
                </p>
            </div>

            {/* Contact Form */}
            <div className="flex justify-center items-center gap-8">
                <div>
                    <Lottie animationData={mail} className="w-lg" />
                </div>
                <div className="w-full max-w-lg p-8 border-2 border-[#dfab81] rounded-lg shadow-lg bg-white"> {/* Increased padding */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Name Input */}
                        <div className="relative">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name" // Added placeholder for name
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="p-3 w-full border rounded-md bg-[#fefdec] focus:outline-none focus:ring-2 focus:ring-[#dfab81] text-[#4c1a36]"
                            />
                        </div>

                        {/* Email Input */}
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3 text-[#395c6b]" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="pl-10 p-3 w-full border rounded-md focus:outline-none bg-[#fefdec] focus:ring-2 focus:ring-[#dfab81] text-[#4c1a36]"
                            />
                        </div>

                        {/* Message Input */}
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="p-3 w-full border rounded-md focus:outline-none bg-[#fefdec] focus:ring-2 focus:ring-[#dfab81] text-[#4c1a36]"
                            rows="5"
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 bg-[#4c1a36] text-white p-3 rounded-md hover:bg-[#dfab81] transition"
                        >
                            <FaPaperPlane />
                            Send Message
                        </button>
                    </form>

                    {/* Status Message */}
                    {status && (
                        <p className="text-center text-sm mt-3 text-[#4c1a36]">
                            {status}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;
