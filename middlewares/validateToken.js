const jwt = require("jsonwebtoken");
const User = require("../models/User");

const validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    if (!req.body.email && user.id) {
      const email = await User.findById(user.id).select("email");
      req.body.email = email.email;
    }
    req.userId = user.id;
    next();
  } catch (error) {
    console.log("error retrieving token data", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = validateToken;
