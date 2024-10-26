const Task = require("../models/Task");

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, checklist, priority, dueDate, status, itemId, checked } =
      req.body;
    const assignTo = req.assignTo;
    let updateField = {};

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    if (itemId && checked !== undefined) {
      const updateResult = await Task.updateOne(
        { _id: taskId, "checklist.itemId": itemId },
        { $set: { "checklist.$.checked": checked } },
        { new: true, runValidators: true }
      );

      // console.log(updateResult);

      if (updateResult.modifiedCount === 0) {
        return res.status(404).json({
          message: "Failed to update checklist item or item not found",
          success: false,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Checklist item status updated successfully",
      });
    }

    if (assignTo) {
      if (task.assignTo.includes(assignTo)) {
        return res
          .status(401)
          .json({ error: true, message: "task is already assign to the user" });
      } else if (assignTo === task.createdBy.toString()) {
        return res.status(401).json({
          error: true,
          message: "you cannot assign task to yourself!",
        });
      }
      updateField.assignTo = [...task.assignTo, assignTo];
    }

    if (title) updateField.title = title;
    if (priority) updateField.priority = priority;
    if (dueDate) updateField.dueDate = dueDate;
    if (status) updateField.status = status;
    if (checklist) updateField.checklist = checklist;

    await Task.findByIdAndUpdate(taskId, updateField, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Task updated successfully!",
    });
  } catch (error) {
    console.error("Error updating the task:", error);
    return res.status(500).json({
      message: "Error updating the task",
      error: false,
    });
  }
};

module.exports = updateTask;
