const Task = require("../models/Task");

const assignAllTask = async (req, res) => {
  try {
    const { assignTo, userId } = req;

    if (addignTo === req.userId) {
      a;
      return res.status(401).json({
        error: true,
        message: "you cannot assign task to yourself!",
      });
    }

    await Task.updateMany({ createdBy: userId }, { $addToSet: assignTo });

    return res.status(200).json({
      success: true,
      message: "User added successfully",
    });
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ error: true, message: "Error adding user!" });
  }
};

module.exports = assignAllTask;
