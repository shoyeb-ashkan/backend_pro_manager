const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const userRouter = require("./routes/userRouter");
const taskRouter = require("./routes/taskRouter");

const PORT = process.env.PORT || 8000;
// creating app
const app = express();

const allowedOrigins = [
  process.env.PRODUCTION_CLIENT_URL,
  process.env.DEVELOPMENT_CLIENT_URL,
].filter(Boolean)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
  })
);

//middleware routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port ", PORT);
});

app.on("error", onError);

//handling error for server
function onError(error) {
  if (error.syscall === "listen") {
    throw error;
  }

  switch (error.code) {
    case "EACCES":
      console.error(PORT + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(PORT + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}
