const Task = require("../models/Task");

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ error, message: "Task not found", error: true });
    }

    await task.deleteOne();
    return res.status(200).json({
      message: "Task deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting the task:", error);
    return res.status(500).json({
      message: "Error deleting the task",
      success: false,
    });
  }
};

module.exports = deleteTask;
