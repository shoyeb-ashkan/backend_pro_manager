const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.userId;
    // Create a case-insensitive regular expression
    const query = new RegExp(search, "i");

    const users = await User.find({
      $and: [{ email: query }, { _id: { $ne: userId } }],
    })
      .select("name email _id")
      .limit(10);
    return res.status(200).json({
      success: true,
      data: users,
      message: "Users found",
    });
  } catch (error) {
    console.error("Error searching for users:", error);
    return res
      .status(500)
      .json({ error: true, message: "Error finding Users: Invalid input" });
  }
};

module.exports = getUsers;
