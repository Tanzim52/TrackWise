// import React from 'react';

import { Link, Outlet } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="grid grid-cols-12  items-stretch">
            <section className="col-span-2 grid-flow-col-dense" >
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col items-center justify-center">
                        {/* Page content here */}
                        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                            Open drawer
                        </label>
                    </div>
                    <div className="drawer-side  ">
                        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                            {/* Sidebar content here */}
                            <li><Link to="my-tasks">My Tasks</Link></li>
                            <li><Link to='add-tasks'>Add Task</Link></li>
                            <li><Link to='reminders'>Reminders</Link></li>
                            <li><Link to='expenses'>My Expenses</Link></li>
                            <li><Link to='add-expense'>Add Expenses</Link></li>
                            <li><Link to='my-budget'>My Budget</Link></li>
                            <li><Link to='insights'>Expense Insights</Link></li>
                            <li><Link to='/'>Home</Link></li>
                        </ul>
                    </div>
                </div>
            </section>

            <div className="col-span-10" >
                <Outlet></Outlet>
            </div>


        </div>
    );
};

export default Dashboard;