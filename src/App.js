import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";




function App() {
  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("darkMode") === "true";
});

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");


  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
  localStorage.setItem("darkMode", darkMode);
}, [darkMode]);

 const addTask = () => {
  if (!task.trim()) return;
  const newTask = {
    text: task,
    completed: false,
    dueDate,
    priority,
  };
  setTasks([...tasks, newTask]);
  setTask("");
  setDueDate("");
  setPriority("Medium");
};


  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const deleteTask = (index) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  const updated = tasks.filter((_, i) => i !== index);
  setTasks(updated);
};


   const filteredTasks = tasks.filter((t) => {
  const matchesFilter =
    filter === "All" ||
    (filter === "Active" && !t.completed) ||
    (filter === "Completed" && t.completed);

  const matchesSearch = t.text.toLowerCase().includes(searchTerm.toLowerCase());

  return matchesFilter && matchesSearch;
});


 return (
  <div className={`min-h-screen px-4 py-10 flex items-center justify-center transition-colors duration-300 ${
    darkMode
      ? "bg-gray-900 text-white"
      : "bg-gradient-to-tr from-purple-400 via-pink-300 to-blue-300 text-black"
  }`}>
    <div className={`w-full max-w-md rounded-xl shadow-lg p-6 border transition-all duration-300 ${
      darkMode
        ? "bg-white/10 backdrop-blur-md border-white/10"
        : "bg-white/30 backdrop-blur-md border-white/20"
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-center text-white w-full">
          Task Tracker
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 text-2xl transition-transform duration-500 transform hover:scale-110"
          style={{ transform: `rotateY(${darkMode ? 180 : 0}deg)` }}
          title="Toggle Dark Mode"
        >
          <span className="inline-block transition-transform duration-500">
            {darkMode ? "🌞" : "🌙"}
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
          className={`border p-2 rounded ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'border-gray-300'}`}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={`border p-2 rounded ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'border-gray-300'}`}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className={`border p-2 rounded ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'border-gray-300'}`}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          onClick={addTask}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded shadow-md hover:opacity-90 transition"
        >
          Add Task
        </button>
      </div>

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full mb-4 p-2 border rounded ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
      />

      <div className="flex gap-2 mb-4 justify-center">
        {["All", "Active", "Completed"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded ${
              filter === type
                ? "bg-indigo-600 text-white"
                : "bg-white/50 text-gray-800"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <ul className="flex flex-col justify-between p-4 rounded-2xl shadow-xl">
        <AnimatePresence>
          {filteredTasks.map((t, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: t.completed ? 0.5 : 1,
                x: 0,
                backgroundColor: t.completed
                  ? "#e5e7eb"
                  : t.priority === "High"
                  ? "#ef4444"
                  : t.priority === "Medium"
                  ? "#facc15"
                  : "#22c55e",
                color: t.completed
                  ? "#6b7280"
                  : t.priority === "Medium"
                  ? "#000000"
                  : "#ffffff"
              }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between p-2 border rounded bg-gray-50"
            >
              <span
                onClick={() => toggleTask(i)}
                className={`flex-1 cursor-pointer break-words ${
                  t.completed
                    ? darkMode
                      ? "line-through text-gray-400"
                      : "line-through text-gray-600"
                    : darkMode
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {t.text}
                <div
                  className="text-sm mt-1 text-black"
                >
                  Due: {t.dueDate || "N/A"} |{' '}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
  t.priority === "High"
    ? darkMode
      ? "bg-red-600 text-white"
      : "bg-red-100 text-red-700"
    : t.priority === "Medium"
    ? darkMode
      ? "bg-yellow-300 text-black"
      : "bg-yellow-100 text-yellow-700"
    : darkMode
    ? "bg-green-500 text-white"
    : "bg-green-100 text-green-700"
}`}
                  >
                    {t.priority}
                  </span>
                </div>
              </span>

              <button
                onClick={() => deleteTask(i)}
                className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  </div>
);



}

export default App;
