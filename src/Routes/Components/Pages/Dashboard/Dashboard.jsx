import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const Dashboard = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <div className="grid grid-cols-12 min-h-screen">
            {/* Sidebar */}
            <section
                className={`col-span-12 lg:col-span-2 fixed lg:relative bg-base-200 transition-transform duration-300 
                ${isDrawerOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
                style={{ height: "100vh" }}
            >
                <div className="w-80 p-4 h-full relative">
                    {/* Close button (only visible on smaller screens) */}
                    <button 
                        onClick={closeDrawer} 
                        className="absolute top-4 right-4 lg:hidden btn btn-sm btn-error"
                    >
                        ✖
                    </button>

                    <ul className="menu text-base-content min-h-full">
                        <li><Link to="/dashboard" onClick={closeDrawer}>Dashboard</Link></li>
                        <li><Link to="my-tasks" onClick={closeDrawer}>My Tasks</Link></li>
                        <li><Link to="add-tasks" onClick={closeDrawer}>Add Task</Link></li>
                        <li><Link to="reminders" onClick={closeDrawer}>Reminders</Link></li>
                        <li><Link to="expenses" onClick={closeDrawer}>My Expenses</Link></li>
                        <li><Link to="add-expense" onClick={closeDrawer}>Add Expenses</Link></li>
                        <li><Link to="my-budget" onClick={closeDrawer}>My Budget</Link></li>
                        <li><Link to="insights" onClick={closeDrawer}>Expense Insights</Link></li>
                        <li><Link to="/" onClick={closeDrawer}>Home</Link></li>
                    </ul>
                </div>
            </section>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-10 min-h-screen">
                <div className="p-4">
                    <button onClick={toggleDrawer} className="btn btn-primary lg:hidden">
                        {isDrawerOpen ? "Close" : "Open Drawer"}
                    </button>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;
