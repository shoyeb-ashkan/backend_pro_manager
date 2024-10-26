const { default: mongoose, Types } = require("mongoose");
const Task = require("../models/Task");

const getTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid input",
      });
    }

    const task = await Task.findById(taskId).select(
      "-_id priority title checklist dueDate"
    );
    if (!task) {
      return res.status(404).json({
        error: true,
        message: "Task not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: task,
      message: "Task fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return res.status(500).json({
      error: true,
      message: "Error fetching task",
    });
  }
};

module.exports = getTask;
