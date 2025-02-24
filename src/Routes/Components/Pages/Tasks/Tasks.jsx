// import React from 'react';

import { Link, Outlet } from "react-router-dom";

const Tasks = () => {
    return (
        <div className="flex">
            <section>
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col items-center justify-center">
                        {/* Page content here */}
                        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                            Open drawer
                        </label>
                    </div>
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                            {/* Sidebar content here */}
                            <li><Link to="my-tasks">My Tasks</Link></li>
                            <li><Link to='add-tasks'>Add Task</Link></li>
                        </ul>
                    </div>
                </div>
            </section>

            <div>
                <Outlet></Outlet>
            </div>


        </div>
    );
};

export default Tasks;