const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "moderate", "high"],
    },
    dueDate: {
      type: Date,
      default: null,
    },
    checklist: {
      type: [
        {
          itemId: {
            type: String,
            required: true,
          },
          text: {
            type: String,
            required: true,
          },
          checked: {
            type: Boolean,
            default: false,
          },
        },
      ],
      required: true,
      validate: {
        validator: (value) => value && value.length > 0,
        message: "Checklist must contain at least one item.",
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["backlog", "in-progress", "done", "to-do"],
      default: "to-do",
    },
    assignTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
