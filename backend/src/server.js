const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define Schema and Model
const taskSchema = new mongoose.Schema({
    task: String,
    date: String,
    completed: { type: Boolean, default: false }
});

const TaskModel = mongoose.model("tasks", taskSchema);

// Add Task
app.post("/add-task", async (req, res) => {
    try {
        const newTask = new TaskModel(req.body);
        await newTask.save();
        res.json({ message: "Task added successfully", task: newTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await TaskModel.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Task (Edit task or mark as done)
app.put("/update-task/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await TaskModel.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Task
app.delete("/delete-task/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await TaskModel.findByIdAndDelete(id);
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});