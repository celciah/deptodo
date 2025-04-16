"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker"; // React Date Picker (Alternative)
import "react-datepicker/dist/react-datepicker.css"; // Import Styles

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [date, setDate] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Fetch tasks from the backend on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3001/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSubmit = async () => {
    if (task.trim() === "" || !date) return;

    try {
      if (editingTaskId !== null) {
        // Update existing task
        await axios.put(`http://localhost:3001/update-task/${editingTaskId}`, { task, date });
      } else {
        // Add new task
        await axios.post("http://localhost:3001/add-task", { task, date, completed: false });
      }
      setTask("");
      setDate(null);
      setEditingTaskId(null);
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEdit = (task) => {
    setTask(task.task);
    setDate(task.date);
    setEditingTaskId(task._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/delete-task/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDone = async (id, completed) => {
    try {
      await axios.put(`http://localhost:3001/update-task/${id}`, { completed: !completed });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="container">
      <div className="task-container">
        <h1 className="title">Task Manager</h1>

        {/* Calendar with Native Input + React Date Picker Fallback */}
        <div className="calendar-container">
          <label htmlFor="task-date">Select Date:</label>
          <input
            id="task-date"
            type="date"
            value={date ? date.toISOString().split("T")[0] : ""}
            onChange={(e) => setDate(new Date(e.target.value))}
            className="input-box"
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
              backgroundColor: "#fff",
            }}
          />
          <p style={{ textAlign: "center", fontSize: "14px", color: "#888" }}>OR</p>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            className="input-box"
            placeholderText="Pick a date"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        {/* Task Input */}
        <input 
          type="text" 
          placeholder="Enter your task..." 
          value={task} 
          onChange={(e) => setTask(e.target.value)} 
          className="input-box" 
        />

        {/* Submit Button */}
        <button onClick={handleSubmit} className="submit-btn">
          {editingTaskId ? "Update" : "Submit"}
        </button>

        {/* Task List */}
        <div className="task-list">
          {tasks.map((t) => (
            <div key={t._id} className={`task-item ${t.completed ? "completed" : ""}`}>
              <span>{t.date} - {t.task}</span>
              <div className="buttons">
                <button onClick={() => handleDone(t._id, t.completed)} className="done-btn">✔</button>
                <button onClick={() => handleEdit(t)} className="edit-btn">✏</button>
                <button onClick={() => handleDelete(t._id)} className="delete-btn">🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
