import { FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer flex flex-col  items-center bg-[#4c1a36] text-[#fefdec] p-10 ">
      {/* Navigation Links */}
      <nav className="flex justify-center  items-center gap-6">
        <a href="/about" className="link link-hover">
          About Us
        </a>
        <a href="/contact" className="link link-hover">
          Contact Us
        </a>
      </nav>

      {/* Social Links */}
      <nav className="flex gap-4 mt-4">
        <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
          <FaLinkedinIn className="text-2xl hover:text-blue-500 transition duration-300" />
        </a>
        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
          <FaFacebookF className="text-2xl hover:text-blue-600 transition duration-300" />
        </a>
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
          <FaGithub className="text-2xl hover:text-gray-700 transition duration-300" />
        </a>
      </nav>

      {/* Copyright */}
      <aside className="mt-4 text-center">
        <p>Copyright © {new Date().getFullYear()} - All rights reserved by Zero Degree Development</p>
      </aside>
    </footer>
  );
};

export default Footer;
