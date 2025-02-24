import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";
import "animate.css";
import { AuthContext } from "../AuthProvider/AuthProvider";

const AddTask = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [tags, setTags] = useState([]);

  const { user } = useContext(AuthContext);

  console.log(user?.email, user?.displayName, user?.photoURL);

  // Handle tag input
  const handleAddTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      setTags([...tags, e.target.value.trim()]);
      e.target.value = "";
      e.preventDefault();
    }
  };

  // Handle form submission
  const submitForm = async (data) => {
    if (!data.title) {
      alert("Title is required!");
      return;
    }

    const taskData = { ...data, tags, email: user?.email, displayName: user?.displayName, photoURL: user?.photoURL };

    console.log("Task Added:", taskData);

    try {
      const response = await axios.post("http://localhost:5000/tasks", taskData);
      console.log("Task Added:", response.data);
      alert("Task successfully added!");
      reset();
      setTags([]);
    } catch (error) {
      console.error("Error adding task:", error, error.message);
      alert("Failed to add task.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg animate__animated animate__fadeIn"
    >
      <h2 className="text-3xl font-bold mb-4 text-center animate__animated animate__zoomIn">
        Add New Task
      </h2>

      <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
        {/* User Info (Readonly Fields) */}


        {/* Task Title */}
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <label className="block font-semibold">Task Title</label>
          <input type="text" {...register("title", { required: true })} className="w-full px-3 py-2 border rounded-md" placeholder="Enter task title" />
        </motion.div>

        {/* Description */}
        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <label className="block font-semibold">Description</label>
          <textarea {...register("description")} className="w-full px-3 py-2 border rounded-md" placeholder="Enter task details"></textarea>
        </motion.div>

        {/* Category */}
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
          <label className="block font-semibold">Category</label>
          <select {...register("category")} className="w-full px-3 py-2 border rounded-md">
            <option value="Assignment">Assignment</option>
            <option value="Exam">Exam</option>
            <option value="Study Session">Study Session</option>
            <option value="Project">Project</option>
            <option value="Personal Task">Personal Task</option>
          </select>
        </motion.div>

        {/* Due Date */}
        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
          <label className="block font-semibold">Due Date</label>
          <input type="date" {...register("dueDate", { required: true })} className="w-full px-3 py-2 border rounded-md" />
        </motion.div>

        {/* Priority Level */}
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
          <label className="block font-semibold">Priority Level</label>
          <select {...register("priority")} className="w-full px-3 py-2 border rounded-md">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </motion.div>

        {/* Tags Input */}
        <div className="hidden" >
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
            <label className="block font-semibold">Email</label>
            <input type="email" value={user?.email || ""} readOnly className="w-full px-3 py-2 border rounded-md" />

            <label className="block font-semibold">Name</label>
            <input type="text" value={user?.displayName || ""} readOnly className="w-full px-3 py-2 border rounded-md" />

            <label className="block font-semibold">Profile Picture URL</label>
            <input type="text" value={user?.photoURL || ""} readOnly className="w-full px-3 py-2 border rounded-md" />
          </motion.div>
        </div>


        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <input type="checkbox" {...register("reminder")} />
          <label className="font-semibold">Set Reminder</label>
          {watch("reminder") && (
            <input
              type="time"
              {...register("reminderTime")}
              className="px-3 py-2 border rounded-md"
            />
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
          Add Task 🚀
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddTask;








