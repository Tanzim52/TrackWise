import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpReminders = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/tasks');
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const next10Days = new Date(today);
                next10Days.setDate(today.getDate() + 3);

                const filteredTasks = response.data.filter(task => {
                    const taskDate = new Date(task.dueDate);
                    return taskDate >= today && taskDate <= next10Days;
                }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

                setTasks(filteredTasks);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch tasks');
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading) {
        return <div className="text-center py-4">Loading upcoming tasks...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-4">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Upcoming Reminders (Next 03 Days)</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Title</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Category</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Due Date</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Priority</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Reminder Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center p-4 text-gray-500">
                                    No upcoming tasks in the next 10 days
                                </td>
                            </tr>
                        ) : (
                            tasks.map((task, index) => (
                                <tr key={task._id} className={`${index % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-gray-100`}>
                                    <td className="p-3 text-sm text-gray-700">{task.title}</td>
                                    <td className="p-3 text-sm text-gray-700">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {task.category}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm text-gray-700">
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="p-3 text-sm">
                                        <span className={`px-2 py-1 rounded ${
                                            task.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                                            task.priority === 'High' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm text-gray-700">
                                        {task.reminder ? task.reminderTime : 'None'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UpReminders;