const jwt = require("jsonwebtoken");

const getUserFromToken = (token) => {
  const user = jwt.verify(token, process.env.JWT_SECRET);

  if (!user) {
    return null;
  }

  return user.id;
};

module.exports = getUserFromToken;