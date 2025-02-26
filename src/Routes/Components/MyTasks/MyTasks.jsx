import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthProvider/AuthProvider";

const MyTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("priority");

  useEffect(() => {
    axios
      .get("http://localhost:5000/tasks")
      .then((res) => {
        const userTasks = res.data.filter((task) => task.email === user?.email);
        setTasks(userTasks);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [user?.email]);

  const sortTasks = (tasks, sortBy) => {
    switch (sortBy) {
      case "priority":
        return tasks.sort((a, b) => {
          const priorityOrder = ["Urgent", "High", "Medium", "Low"];
          return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
        });
      case "dueDate":
        return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      case "reminder":
        return tasks.sort((a, b) => (a.reminder ? -1 : 1));
      default:
        return tasks;
    }
  };

  const handleDelete = async (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:5000/tasks/${taskId}`);
          if (response.data.success) {
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
            Swal.fire("Deleted!", "Your task has been deleted.", "success");
          } else {
            Swal.fire("Error", "Task not found or already deleted.", "error");
          }
        } catch (error) {
          console.error("Error deleting task:", error);
          Swal.fire("Error", "Something went wrong.", "error");
        }
      }
    });
  };

  const handleUpdate = async () => {
    if (!selectedTask.title || !selectedTask.description || !selectedTask.category) {
      Swal.fire("Warning", "Title, description, and category are required!", "warning");
      return;
    }

    try {
      const updatedData = {
        title: selectedTask.title,
        description: selectedTask.description,
        category: selectedTask.category,
        priority: selectedTask.priority,
        dueDate: selectedTask.dueDate,
        reminder: selectedTask.reminder,
        reminderTime: selectedTask.reminder ? selectedTask.reminderTime : null,
      };

      const response = await axios.put(`http://localhost:5000/tasks/${selectedTask._id}`, updatedData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        setTasks((tasks) =>
          tasks.map((task) =>
            task._id === selectedTask._id ? { ...task, ...updatedData } : task
          )
        );
        Swal.fire("Updated!", "Your task has been updated successfully.", "success");
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };
  
  const sortedTasks = sortTasks([...tasks], sortBy); // Clone tasks to avoid direct mutation

  return (
    <div className="min-h-screen p-8 bg-[#fefdec]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-[#4c1a36]">My Tasks</h2>

        {/* Sorting Controls */}
        <div className="flex space-x-4 mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-[#4c1a36]/20 text-[#4c1a36] bg-transparent focus:outline-none focus:border-[#4c1a36]/40 transition-colors"
          >
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="reminder">Sort by Reminder</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <div 
                key={task._id} 
                className="relative p-6 rounded-xl bg-[#ffffffb3] backdrop-blur-sm border border-[#ffffff] shadow-lg hover:shadow-xl transition-all"
              >
                <h3 className="text-xl font-bold mb-2 text-[#4c1a36]">{task.title}</h3>
                <p className="text-[#395c6b] mb-4">{task.description}</p>
                
                <div className="space-y-2 text-[#395c6b]">
                  <p>
                    <span className="font-semibold">Category:</span> {task.category}
                  </p>
                  <p>
                    <span className="font-semibold">Priority:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                      task.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                      task.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {task.priority}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Due Date:</span> 
                    <span className="ml-2">{new Date(task.dueDate).toLocaleDateString()}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Reminder:</span> 
                    <span className={`ml-2 ${task.reminder ? 'text-green-600' : 'text-gray-400'}`}>
                      {task.reminder ? "✓ Set" : "None"}
                    </span>
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => openModal(task)}
                    className="px-4 py-2 bg-[#4c1a36] text-white rounded-lg hover:bg-[#3a1329] transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="px-4 py-2 bg-[#b13e53] text-white rounded-lg hover:bg-[#8a2f42] transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[#395c6b] text-lg">No tasks found. Start by creating a new task!</p>
          )}
        </div>

        {/* Update Task Modal */}
        {modalOpen && selectedTask && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-[#4c1a36]">Update Task</h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                  className="w-full p-3 rounded-lg border-2 border-[#4c1a36]/20 focus:border-[#4c1a36]/40 focus:outline-none text-[#4c1a36]"
                  placeholder="Title"
                />
                
                <textarea
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                  className="w-full p-3 rounded-lg border-2 border-[#4c1a36]/20 focus:border-[#4c1a36]/40 focus:outline-none text-[#4c1a36]"
                  placeholder="Description"
                  rows="3"
                />
                
                <input
                  type="text"
                  value={selectedTask.category}
                  onChange={(e) => setSelectedTask({ ...selectedTask, category: e.target.value })}
                  className="w-full p-3 rounded-lg border-2 border-[#4c1a36]/20 focus:border-[#4c1a36]/40 focus:outline-none text-[#4c1a36]"
                  placeholder="Category"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#395c6b] mb-2">Due Date</label>
                    <input
                      type="date"
                      value={selectedTask.dueDate}
                      onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                      className="w-full p-3 rounded-lg border-2 border-[#4c1a36]/20 focus:border-[#4c1a36]/40 focus:outline-none text-[#4c1a36]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#395c6b] mb-2">Priority</label>
                    <select
                      value={selectedTask.priority}
                      onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
                      className="w-full p-3 rounded-lg border-2 border-[#4c1a36]/20 focus:border-[#4c1a36]/40 focus:outline-none text-[#4c1a36]"
                    >
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedTask.reminder}
                      onChange={() => setSelectedTask({ ...selectedTask, reminder: !selectedTask.reminder })}
                      className="h-5 w-5 text-[#4c1a36] focus:ring-[#4c1a36] border-2 border-[#4c1a36]/30 rounded"
                    />
                    <span className="text-[#395c6b]">Set Reminder</span>
                  </label>
                  
                  {selectedTask.reminder && (
                    <div className="mt-3">
                      <input
                        type="time"
                        value={selectedTask.reminderTime || ""}
                        onChange={(e) => setSelectedTask({ ...selectedTask, reminderTime: e.target.value })}
                        className="w-full p-3 rounded-lg border-2 border-[#4c1a36]/20 focus:border-[#4c1a36]/40 focus:outline-none text-[#4c1a36]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex gap-3 justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 rounded-lg border-2 border-[#4c1a36]/20 text-[#4c1a36] hover:bg-[#4c1a36]/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-5 py-2 bg-[#4c1a36] text-white rounded-lg hover:bg-[#3a1329] transition-colors"
                >
                  Update Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
