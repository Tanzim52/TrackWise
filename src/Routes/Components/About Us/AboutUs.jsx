import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Contact from "../Home/Contact/Contact";

const teamMembers = [
    {
        name: "Md Mahin Jawad Tanzim",
        description: "Fresher still passionate & skilled Front-end focused MERN Stack Developer.A bit of a perfectionist,minimalist & a game rat.",
        education: "B.Sc. in Computer Science & Engineering (NeU,2023 - present)",
        photo: "https://i.ibb.co.com/YFHb2gXV/Picsart-25-02-05-04-24-09-049.jpg",
        linkedin: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe",
        portfolio: "https://johndoe.com",
    },
    {
        name: "Muhammad Abdullah Al Zubayer",
        description: "Skilled,creative & eager to learn Front-end focused MERN Stack Web Developer. Focused & a team player.",
        education: "B.Sc. in Computer Science & Engineering (NeU,2023 - present)",
        photo: "https://i.ibb.co.com/vxGfW8bF/nahin.jpg",
        linkedin: "https://linkedin.com/in/janesmith",
        github: "https://github.com/janesmith",
        portfolio: "https://janesmith.com",
    },
    {
        name: "Md Mirajul Islam",
        description: "A MERN Stack Developer with a passion for coding and a keen eye for detail. Always ready to learn and adapt.",
        education: "B.Sc. in Computer Science & Engineering (NeU,2023 - present)",
        photo: "https://i.ibb.co.com/0FWdyZV/dics.jpg",
        linkedin: "https://linkedin.com/in/alexjohnson",
        github: "https://github.com/alexjohnson",
        portfolio: "https://alexjohnson.com",
    },
];

const AboutUs = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    return (
        <>
            <div className="p-5 bg-[#fefdec]">
                <h2 className="text-2xl md:text-3xl font-bold text-[#4c1a36] text-center mb-4" data-aos="fade-up">
                    Meet Team ZeroDegree
                </h2>
                <p className="text-base md:text-lg text-[#395c6b] text-center mb-8" data-aos="fade-up" data-aos-delay="200">
                    Our dedicated team members whose skills and passion drive ZeroDegree forward.
                </p>

                <div className="max-w-7xl mx-auto space-y-8">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            data-aos="fade-up"
                            data-aos-delay={300 * index}
                            className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} 
            bg-white/50 rounded-lg shadow-lg overflow-hidden`}
                        >
                            {/* Image Section */}
                            <div className="md:w-1/2 p-4">
                                <img
                                    src={member.photo}
                                    alt={member.name}
                                    className="w-full h-64 md:h-80 object-cover rounded-lg transform transition duration-500 hover:scale-105"
                                />
                            </div>

                            {/* Content Section */}
                            <div className="md:w-1/2 p-6 flex flex-col justify-center">
                                <h3 className="text-xl md:text-2xl font-semibold text-[#4c1a36] mb-3">
                                    {member.name}
                                </h3>

                                <p className="text-sm md:text-base text-[#395c6b] mb-4 leading-relaxed">
                                    {member.description}
                                </p>

                                <p className="text-xs md:text-sm text-gray-500 mb-4">
                                    {member.education}
                                </p>

                                <div className="flex gap-4">
                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                                        className="hover:opacity-75 transition-opacity">
                                        <FaLinkedin className="text-[#4c1a36] text-xl md:text-2xl" />
                                    </a>
                                    <a href={member.github} target="_blank" rel="noopener noreferrer"
                                        className="hover:opacity-75 transition-opacity">
                                        <FaGithub className="text-[#4c1a36] text-xl md:text-2xl" />
                                    </a>
                                    <a href={member.portfolio} target="_blank" rel="noopener noreferrer"
                                        className="hover:opacity-75 transition-opacity">
                                        <FaGlobe className="text-[#4c1a36] text-xl md:text-2xl" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <Contact></Contact>
            </div>
        </>
    );
};

export default AboutUs;