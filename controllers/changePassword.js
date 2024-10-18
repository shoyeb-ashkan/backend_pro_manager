const bcrypt = require("bcrypt");
const User = require("../models/User");

const changePassword = async (req, res) => {
  const { password, newPassword } = req.body;
  const userId = req.userId;

  try {
    if (!newPassword) {
      return res.status(400).json({ message: "Please provide new passwords." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid old password." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;

    await user.save();
    return res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = changePassword;
