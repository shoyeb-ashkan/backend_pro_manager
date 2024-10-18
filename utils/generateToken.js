const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = async (userId) => {
  return await jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

module.exports = generateToken;
