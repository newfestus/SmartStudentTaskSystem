const mongoose = require("mongoose");
const Task = require("../models/Task");

exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await Task.countDocuments({ userId });
    const completed = await Task.countDocuments({ userId, status: "Completed" });
    const pending = await Task.countDocuments({ userId, status: "Pending" });

    const byPriorityAgg = await Task.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    const byPriority = { Low: 0, Medium: 0, High: 0 };
    for (const item of byPriorityAgg) {
      byPriority[item._id] = item.count;
    }

    res.json({ total, completed, pending, byPriority });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};