const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || !isMatch) {
      return res.status(400).json({ message: "Wrong Email  or Password" });
    }

    const token = await generateToken(user._id);

    return res.status(200).json({ token });
  } catch (error) {
    console.log("Error while logging in user", error);
    return res.status(500).json({ message: "Error while logging in user" });
  }
};

module.exports = loginUser;
