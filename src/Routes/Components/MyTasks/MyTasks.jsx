import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthProvider/AuthProvider";
// import { AuthContext } from "../contexts/AuthProvider"; // Assuming you use Context API for authentication

const MyTasks = () => {
    const { user } = useContext(AuthContext);
    console.log(user?.email, user?.displayName, user?.photoURL);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/tasks") // Replace with your deployed backend URL if needed
            .then(res => {
                const userTasks = res.data.filter(task => task.email === user?.email);
                setTasks(userTasks);
            })
            .catch(error => console.error("Error fetching tasks:", error));
    }, [user?.email]);

    return (
        <div className="max-w-4xl mx-auto p-5">
            <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <div key={task._id} className="border p-4 rounded-lg shadow-md bg-white">
                            <h3 className="text-lg font-semibold">{task.title}</h3>
                            <p className="text-gray-600">{task.description}</p>
                            <p className="mt-2">
                                <span className="font-bold">Priority:</span> {task.priority}
                            </p>
                            <p>
                                <span className="font-bold">Due Date:</span> {task.dueDate}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No tasks found.</p>
                )}
            </div>
        </div>
    );
};

export default MyTasks;
