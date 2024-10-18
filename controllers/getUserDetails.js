const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const getUserFromToken = require("../utils/getUserIdFromToken");

const getUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("name email _id");
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user details", error);
    return res.status(500).json({ message: "Error retrieving user details" });
  }
};

module.exports = getUserDetails;
