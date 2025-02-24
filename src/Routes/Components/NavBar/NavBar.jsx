import { useContext } from "react";
import { MdLogout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";

const NavBar = () => {


    const navigate = useNavigate()

    const { logout, user } = useContext(AuthContext); // Access the logout function

    const handleLogout = async () => {
        try {
            await logout(); // Call the logout function
            console.log("Logged out successfully!");
            navigate('signin')
        } catch (error) {
            console.error("Logout error:", error.message);
        }
    };

    const links = <>
        <li> <Link to="tasks" >Tasks</Link> </li>
        <li> <Link to="reminders" >Reminders</Link> </li>
        <li> <Link to="expenses" >Expenses</Link> </li>
    </>






    return (
        <div className="navbar mainPrimary text-[#fefdec]  shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl">daisyUI</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>
            <div className="navbar-end">
                {
                    user?.email ? (<a onClick={handleLogout} className="btn flex items-center justify-center"><MdLogout className="text-lg"></MdLogout> <p>Logout</p></a>)
                    :
                    <Link to="signin" className="btn flex items-center justify-center"><MdLogout className="text-lg"></MdLogout> <p>Login</p></Link>
                }
            </div>
        </div>
    );
};

export default NavBar;