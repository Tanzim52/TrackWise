import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthProvider/AuthProvider";

const MyTasks = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null); // Holds the task being edited
    const [modalOpen, setModalOpen] = useState(false); // Controls modal visibility

    useEffect(() => {
        axios.get("http://localhost:5000/tasks")
            .then(res => {
                const userTasks = res.data.filter(task => task.email === user?.email);
                setTasks(userTasks);
            })
            .catch(error => console.error("Error fetching tasks:", error));
    }, [user?.email]);

    // Function to delete a task
    const handleDelete = async (taskId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/tasks/${taskId}`);
            if (response.data.success) {
                setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
                alert("Task deleted successfully!");
            } else {
                alert("Error: Task not found or already deleted.");
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };
    

    // Open modal and load selected task data
    const openModal = (task) => {
        setSelectedTask(task);
        setModalOpen(true);
    };

    // Handle updating the task
    const handleUpdate = async () => {
        try {
            const updatedData = {
                title: selectedTask.title,
                description: selectedTask.description,
                category: selectedTask.category,
                priority: selectedTask.priority,
                dueDate: selectedTask.dueDate,
                reminder: selectedTask.reminder,
                reminderTime: selectedTask.reminder ? selectedTask.reminderTime : null, // Handle reminder conditionally
            };
    
            const response = await axios.put(`http://localhost:5000/tasks/${selectedTask._id}`, updatedData, {
                headers: { "Content-Type": "application/json" }
            });
    
            if (!selectedTask.title || !selectedTask.description || !selectedTask.category) {
                alert("Title, description, and category are required!");
                return;
            }
            
            if (response.data.success) {
                setTasks(tasks.map(task => task._id === selectedTask._id ? { ...task, ...updatedData } : task));
                alert("Task updated successfully!");
                setModalOpen(false);
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };
    

    return (
        <div className="max-w-4xl mx-auto p-5">
            <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <div key={task._id} className="border p-4 rounded-lg shadow-md bg-white">
                            <h3 className="text-lg font-semibold">{task.title}</h3>
                            <p className="text-gray-600">{task.description}</p>
                            <p><span className="font-bold">Category:</span> {task.category}</p>
                            <p><span className="font-bold">Priority:</span> {task.priority}</p>
                            <p><span className="font-bold">Due Date:</span> {task.dueDate}</p>
                            <p><span className="font-bold">Reminder:</span> {task.reminder ? "Yes" : "No"}</p>
                            {task.reminder && <p><span className="font-bold">Reminder Time:</span> {task.reminderTime}</p>}
                            <div className="mt-3 flex gap-2">
                                <button 
                                    onClick={() => openModal(task)} 
                                    className="bg-blue-500 text-white px-3 py-1 rounded">
                                    Update
                                </button>
                                <button 
                                    onClick={() => handleDelete(task._id)} 
                                    className="bg-red-500 text-white px-3 py-1 rounded">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No tasks found.</p>
                )}
            </div>

            {/* Update Task Modal */}
            {modalOpen && selectedTask && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Update Task</h2>
                        <input
                            type="text"
                            value={selectedTask.title}
                            onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                            className="border p-2 w-full mb-2"
                            placeholder="Title"
                        />
                        <textarea
                            value={selectedTask.description}
                            onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                            className="border p-2 w-full mb-2"
                            placeholder="Description"
                        />
                        <input
                            type="text"
                            value={selectedTask.category}
                            onChange={(e) => setSelectedTask({ ...selectedTask, category: e.target.value })}
                            className="border p-2 w-full mb-2"
                            placeholder="Category"
                        />
                        <input
                            type="date"
                            value={selectedTask.dueDate}
                            onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                            className="border p-2 w-full mb-2"
                        />
                        <select
                            value={selectedTask.priority}
                            onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
                            className="border p-2 w-full mb-2"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                        <label className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                checked={selectedTask.reminder}
                                onChange={(e) => setSelectedTask({ ...selectedTask, reminder: e.target.checked })}
                            />
                            Set Reminder
                        </label>
                        {selectedTask.reminder && (
                            <input
                                type="time"
                                value={selectedTask.reminderTime}
                                onChange={(e) => setSelectedTask({ ...selectedTask, reminderTime: e.target.value })}
                                className="border p-2 w-full mb-2"
                            />
                        )}
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={() => setModalOpen(false)} 
                                className="bg-gray-500 text-white px-3 py-1 rounded">
                                Cancel
                            </button>
                            <button 
                                onClick={handleUpdate} 
                                className="bg-green-500 text-white px-3 py-1 rounded">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTasks;
