const registerUser = require("../controllers/registerUser");
const loginUser = require("../controllers/loginUser");
const validateUser = require("../middlewares/validateUser");
const getUserDetails = require("../controllers/getUserDetails");
const getUsers = require("../controllers/getUsers");
const changePassword = require("../controllers/changePassword");
const validateToken = require("../middlewares/validateToken");
const userRouter = require("express").Router();

userRouter.post("/register", validateUser, registerUser);
userRouter.post("/login", validateUser, loginUser);
userRouter.get("/search", validateToken, getUsers);
userRouter.get("/", validateToken, getUserDetails);
userRouter.post("/changePassword", validateToken, validateUser, changePassword);

module.exports = userRouter;
