import mongoose from "mongoose";
import { NextResponse } from "next/server";

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!global.mongoose) {
  global.mongoose = mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Task Model
const TaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  date: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

// GET: Fetch all tasks
export async function GET() {
  await global.mongoose;
  const tasks = await Task.find();
  return NextResponse.json(tasks);
}

// POST: Add a new task
export async function POST(req) {
  const { task, date } = await req.json();
  await global.mongoose;
  const newTask = await Task.create({ task, date, completed: false });
  return NextResponse.json(newTask);
}

// PUT: Update a task (mark as completed)
export async function PUT(req) {
  const { id, completed } = await req.json();
  await global.mongoose;
  await Task.findByIdAndUpdate(id, { completed });
  return NextResponse.json({ message: "Task updated" });
}

// DELETE: Remove a task
export async function DELETE(req) {
  const { id } = await req.json();
  await global.mongoose;
  await Task.findByIdAndDelete(id);
  return NextResponse.json({ message: "Task deleted" });
}
