import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/tasks');
                const filteredTasks = response.data.filter(task => 
                    task.priority === 'Urgent' 
                );
                setTasks(filteredTasks);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading) {
        return <div className="text-center">Loading tasks...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Top Priority Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.length === 0 ? (
                    <div className="text-gray-500">No urgent/high priority tasks found</div>
                ) : (
                    tasks.map(task => (
                        <div key={task._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold">{task.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                    task.priority === 'Urgent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {task.priority}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4">{task.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                                    {task.category}
                                </span>
                                {task.reminder && (
                                    <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                                        Reminder: {task.reminderTime}
                                    </span>
                                )}
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                <span>{task.email}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TopTasks;