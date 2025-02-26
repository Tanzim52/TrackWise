import { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import { MdLogout } from "react-icons/md";

const Dashboard = () => {


    const navigate = useNavigate()

    const { logout } = useContext(AuthContext); // Access the logout function

    const handleLogout = async () => {
        try {
            await logout(); // Call the logout function
            console.log("Logged out successfully!");
            navigate('/signin')
        } catch (error) {
            console.error("Logout error:", error.message);
        }
    };
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <div className="flex min-h-screen">
            {/* Fixed Sidebar */}
            <section
                className={`fixed top-0 left-0 h-screen transition-transform duration-300 z-20 shadow-xl bg-gradient-to-b from-[#4c1a36] to-[#2d0f1f]`}
                style={{ width: "320px" }}
            >
                <div className="w-full h-full relative">
                    {/* Close button */}
                    <button
                        onClick={closeDrawer}
                        className="absolute top-6 right-6 lg:hidden btn btn-sm btn-circle"
                        style={{
                            backgroundColor: "#395c6b",
                            color: "#fefdec",
                            borderColor: "#fefdec"
                        }}
                    >
                        ✖
                    </button>

                    <ul className="menu min-h-full space-y-1 px-5 pt-10" style={{ color: "#fefdec" }}>
                        {[
                            ["📊 Dashboard", "/dashboard"],
                            ["✅ My Tasks", "my-tasks"],
                            ["➕ Add Task", "add-tasks"],
                            ["⏰ Reminders", "reminders"],
                            ["💰 My Expenses", "expenses"],
                            ["📥 Add Expenses", "add-expense"],
                            ["📈 My Budget", "my-budget"],
                            ["🔍 Expense Insights", "insights"],
                        ].map(([title, to]) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    onClick={closeDrawer}
                                    className="rounded-xl transition-all duration-200 px-4 py-3.5 font-medium hover:bg-[#fefdec]/10 active:bg-[#fefdec]/20"
                                    style={{ color: "#fefdec" }}
                                >
                                    {title}
                                </NavLink>
                            </li>
                        ))}

                        <div className="divider my-2 mx-4" style={{ borderColor: "rgba(254, 253, 236, 0.2)" }}></div>

                        <li>
                            <NavLink
                                to="/"
                                onClick={closeDrawer}
                                className="rounded-xl transition-all duration-200  px-4 py-3.5 font-medium hover:bg-[#fefdec]/10 active:bg-[#fefdec]/20"
                                style={{ color: "#fefdec" }}
                            >
                                🏠 Home
                            </NavLink>

                        </li>
                        <li>
                            <a onClick={handleLogout} className="rounded-xl transition-all duration-200  px-4 py-3.5 font-medium hover:bg-[#fefdec]/10 active:bg-[#fefdec]/20"
                                style={{ color: "#fefdec" }}><MdLogout className="text-lg"></MdLogout> <p>SignOut</p></a>

                        </li>
                    </ul>
                </div>
            </section>

            {/* Main Content */}
            <div
                className="flex-grow lg:ml-80 min-h-screen"
                style={{
                    backgroundColor: "#fefdec",
                    color: "#395c6b",
                }}
            >
                <div className="px-4">
                    <button
                        onClick={toggleDrawer}
                        className="btn lg:hidden"
                        style={{
                            backgroundColor: "#395c6b",
                            color: "#fefdec",
                            borderColor: "#fefdec"
                        }}
                    >
                        {isDrawerOpen ? "Close" : "Open Drawer"}
                    </button>
                </div>
                <div className="p-4">
                    <Outlet />
                </div>
            </div>





            <div>

            </div>
        </div>
    );
};

export default Dashboard;