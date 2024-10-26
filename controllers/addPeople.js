const Task = require("../models/Task");
const User = require("../models/User");

const addPeople = async (req, res) => {
  try {
    const userId = req.userId;
    const userEmail = req.body.userEmail.toLowerCase();

    const assignee = await User.findOne({ email: userEmail });

    if (!assignee) {
      return res.status(404).json({
        error: true,
        message:
          "Unable to add the assignee. Please verify the email or try again.",
      });
    }

    if (assignee._id.toString() === userId.toString()) {
      return res.status(401).json({
        error: true,
        message: "You cannot add yourself to the board!",
      });
    }

    const task = await Task.find({ createdBy: userId });
    if (task.length === 0) {
      return res.status(404).json({
        error: true,
        message: "You have no task created to add people!",
      });
    }

    await Task.updateMany(
      { createdBy: userId },
      { $addToSet: { assignTo: assignee._id } }
    );

    return res.status(200).json({
      success: true,
      data: assignee._id,
      message: "Successfully added people to board!",
    });
  } catch (error) {
    console.error("error adding user to board", error.message);
    return res.status(500).json({
      error: true,
      message:
        "Unable to add the assignee. Please verify the email or try again.",
    });
  }
};

module.exports = addPeople;
