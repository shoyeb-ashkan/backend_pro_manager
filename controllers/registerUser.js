const User = require("../models/User");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const { name, email: reqEmail, password } = req.body;

  const email = reqEmail.toLowerCase();
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ error: true, message: "User already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    console.log("User registered successfully");
    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.log("error while registering user", error);
    res
      .status(500)
      .json({ error: true, message: "Error while registering user" });
  }
};

module.exports = registerUser;
