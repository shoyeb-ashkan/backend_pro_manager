const User = require("../models/User");
const getUserFromToken = require("../utils/getUserIdFromToken");

const getUsers = async (req, res) => {
  try {
    console.log("params", req.params);
    const { search } = req.query;
    const userId = req.userId;
    console.log("first", userId);
    // Create a case-insensitive regular expression
    const query = new RegExp(search, "i");
    console.log("Regex Query:", query);

    const users = await User.find({
      $and: [
        { email: query },
        { _id: { $ne: userId } }, // Exclude the current user
      ],
    })
      .select("name email _id")
      .limit(10); //setting the limit to 10
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error searching for users:", error);
    return res.status(500).json({ message: "Error searching for users:" });
  }
};

module.exports = getUsers;
