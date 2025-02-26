import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider/AuthProvider";

const Reminders = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState("reminderTime");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tasks");
        const userTasks = res.data.filter(
          (task) => task.email === user?.email && task.reminder
        );
        setTasks(userTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [user?.email]);

  const formatTime = (timeString) => {
    if (!timeString) return "Not Set";
    const date = new Date(`1970-01-01T${timeString}`);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const sortTasks = (tasks, sortBy) => {
    return tasks.slice().sort((a, b) => {
      if (sortBy === "reminderTime") {
        return (a.reminderTime || "").localeCompare(b.reminderTime || "");
      }
      if (sortBy === "priority") {
        const priorityOrder = ["urgent", "high", "medium", "low"];
        return (
          priorityOrder.indexOf(a.priority?.toLowerCase()) -
          priorityOrder.indexOf(b.priority?.toLowerCase())
        );
      }
      if (sortBy === "dueDate") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.put(`http://localhost:5000/tasks/${id}`, {
            reminder: false,
          });

          if (res.data.success) {
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
            Swal.fire("Deleted!", "Your reminder has been deleted.", "success");
          }
        } catch (error) {
          console.error("Error updating reminder status:", error);
        }
      }
    });
  };

  const sortedTasks = sortTasks(tasks, sortBy);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">My Reminders</h2>
      <div className="flex justify-end mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select select-bordered"
        >
          <option value="reminderTime">Sort by Reminder Time</option>
          <option value="priority">Sort by Priority</option>
          <option value="dueDate">Sort by Due Date</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Reminder Time</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.length > 0 ? (
              sortedTasks.map((task, index) => (
                <tr key={task._id}>
                  <td>{index + 1}</td>
                  <td className="font-medium">{task.title}</td>
                  <td className="text-blue-600">{formatTime(task.reminderTime)}</td>
                  <td
                    className={`flex justify-center items-center badge ${task.priority?.toLowerCase() === "urgent"
                        ? "bg-red-500 text-white"
                        : task.priority?.toLowerCase() === "high"
                          ? "bg-yellow-500 text-black"
                          : task.priority?.toLowerCase() === "medium"
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                      }`}
                  >
                    {task.priority}
                  </td>

                  <td>{task.dueDate || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-error bg-[#4c1a36] text-white btn-sm"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500">
                  No reminders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reminders;
