const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors({
  origin: "*", // or specify your frontend URL: "https://your-frontend-domain.com"
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
app.use(express.json());
app.use(cors());

// ✅ Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "API for managing tasks",
    },
    servers: [
      {
        url: "https://deptodo-9.onrender.com",
      },
    ],
  },
  apis: ["./server.js"], // or adjust to your file path if needed
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ... your imports and MongoDB connection stay the same

// Define Schema and Model
const taskSchema = new mongoose.Schema({
    task: String,
    date: String,
    completed: { type: Boolean, default: false }
  });
  const TaskModel = mongoose.model("tasks", taskSchema);
  
  /**
   * @swagger
   * /add-task:
   *   post:
   *     summary: Add a new task
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               task:
   *                 type: string
   *               date:
   *                 type: string
   *     responses:
   *       200:
   *         description: Task added successfully
   */
  app.post("/add-task", async (req, res) => {
    try {
      const newTask = new TaskModel(req.body);
      await newTask.save();
      res.json({ message: "Task added successfully", task: newTask });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  /**
   * @swagger
   * /tasks:
   *   get:
   *     summary: Get all tasks
   *     responses:
   *       200:
   *         description: A list of tasks
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   */
  app.get("/tasks", async (req, res) => {
    try {
      const tasks = await TaskModel.find();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  /**
   * @swagger
   * /update-task/{id}:
   *   put:
   *     summary: Update a task
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Task updated successfully
   */
  app.put("/update-task/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTask = await TaskModel.findByIdAndUpdate(id, req.body, { new: true });
      res.json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  /**
   * @swagger
   * /delete-task/{id}:
   *   delete:
   *     summary: Delete a task
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Task deleted successfully
   */
  app.delete("/delete-task/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await TaskModel.findByIdAndDelete(id);
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Hello route (optional)
  app.get("/", (req, res) => {
    res.send("<h1>Hello</h1>");
  });
  
  // ✅ Swagger docs endpoint
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
  
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
  

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});



// Start Server
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs)); // ✅ use 'swaggerDocs'

