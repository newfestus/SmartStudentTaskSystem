const express = require("express");
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController.js");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", createTask);
router.get("/", getTasks);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;