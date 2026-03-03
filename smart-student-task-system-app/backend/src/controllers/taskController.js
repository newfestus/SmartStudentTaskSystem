const Task = require("../models/Task.js");

// CREATE (belongs to logged-in user)
exports.createTask = async (req, res) => {
  try {
    const { title, course, dueDate, priority, status, notes } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Title is required" });

    const task = await Task.create({
      userId: req.user.id,
      title,
      course,
      dueDate,
      priority,
      status,
      notes
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ ALL (only this user's tasks + filters + search)
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, course, q } = req.query;

    const filter = { userId: req.user.id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (course) filter.course = new RegExp(course, "i");
    if (q) filter.$or = [{ title: new RegExp(q, "i") }, { notes: new RegExp(q, "i") }];

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE (only owner)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE (only owner)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};