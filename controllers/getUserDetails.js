const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("name email _id");
    if (!user) {
      return res.status(401).json({ error: true, message: "User not found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "User details retrieved successfully",
        data: user,
      });
  } catch (error) {
    console.error("Error retrieving user details", error);
    return res
      .status(500)
      .json({ error: true, message: "Error retrieving user details" });
  }
};

module.exports = getUserDetails;
