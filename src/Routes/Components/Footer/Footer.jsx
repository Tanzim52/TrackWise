import { FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <section className="bg-gradient-to-r from-[#2d0f1f] to-[#4c1a36]">
            <footer className=" text-[#fefdec] py-10 px-5 md:px-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Logo & Branding */}
                    <div className="flex flex-col justify-start items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-2">
                            <img
                                src="https://i.ibb.co/7th4bsjY/round-fav-icon-for-website-trackwise-removebg-preview.png"
                                alt="TrackWise"
                                className="w-16 md:w-20 mb-2"
                            />
                            <div>
                                <h2 className="text-xl font-bold">TrackWise</h2>
                                <p className="text-sm text-[#dfab81]">Track, Plan & Achieve with Ease</p>
                            </div>
                        </div>
                        
                    </div>

                    {/* Social Links */}
                    <div className="flex flex-col items-center md:items-end">
                        <h6 className="text-lg font-semibold text-[#dfab81] mb-2">Follow Us</h6>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/share/1ANGpUMCLp/" target="_blank" rel="noopener noreferrer">
                                <FaFacebookF className="text-2xl transition transform hover:scale-110 hover:text-[#dfab81]" />
                            </a>
                            <a href="https://www.linkedin.com/in/tanzim52/" target="_blank" rel="noopener noreferrer">
                                <FaLinkedinIn className="text-2xl transition transform hover:scale-110 hover:text-[#dfab81]" />
                            </a>
                            <a href="https://github.com/Tanzim52" target="_blank" rel="noopener noreferrer">
                                <FaGithub className="text-2xl transition transform hover:scale-110 hover:text-[#dfab81]" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}

            </footer>
            <div className="text-center text-xs  text-[#fefdec] pt-6 border-t pb-7">
                &copy; {new Date().getFullYear()} ZeroDegree. All rights reserved.
            </div>
        </section>
    );
};

export default Footer;
