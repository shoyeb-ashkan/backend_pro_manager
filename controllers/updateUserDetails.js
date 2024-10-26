const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const updateUserDetails = async (req, res) => {
  try {
    // console.log(req.body);
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: true, message: "User not found" });
    }
    const { name, email, password, newPassword } = req.body;
    const findByEmail = await User.findOne({ email });
    if (findByEmail) {
      return res.status(400).json({
        error: true,
        message: "User with current email already exists",
      });
    }

    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: true, message: "Wrong password!" });
      }
    }

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
    });
  } catch (error) {
    console.error("Error updating user details", error);
    return res
      .status(500)
      .json({ error: true, message: "Error updating user details" });
  }
};

module.exports = updateUserDetails;
