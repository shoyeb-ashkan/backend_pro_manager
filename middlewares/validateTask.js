const { body, validationResult } = require("express-validator");
const moment = require("moment");
const mongoose = require("mongoose");

const validateTask = async (req, res, next) => {
  await body("title").notEmpty().withMessage("title is required!").run(req);

  await body("priority")
    .notEmpty()
    .withMessage("priority is required!")
    .isIn(["low", "moderate", "high"])
    .withMessage("Priority must be one of the following: low, moderate, high.")
    .run(req);

  await body("dueDate")
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage(
      "Please provide a valid date! (format:YYYY-MM-DD, YYYY-MM-DDTHH:mm, RFC 1123 or a human-readable)"
    )
    .custom((value) => {
      const dueDate = moment(value, moment.ISO_8601, true);
      const today = moment().startOf("day");
      if (!dueDate.isValid()) {
        throw new Error("Please provide ok a valid date!");
      }

      if (dueDate.isBefore(today)) {
        throw new Error("Due date cannot be in the past");
      }
      return true;
    })
    .run(req);

  await body("assignTo")
    .optional({ checkFalsy: true })
    .custom((assignTo) => {
      let assignToId;

      const creatorId = req.userId;
      if (assignTo === undefined) {
        return true;
      }
      if (typeof assignTo === "string") {
        if (!mongoose.Types.ObjectId.isValid(assignTo)) {
          throw new Error("Please provide a valid user ID.");
        }
        if (assignTo === creatorId) {
          throw new Error("You cannot assign the task to yourself.");
        }

        assignToId = assignTo;
      } else if (Array.isArray(assignTo)) {
        if (assignTo.length > 1) {
          throw new Error("Only one assignee can be assigned at a time.");
        }
        if (
          assignTo.length === 1 &&
          !mongoose.Types.ObjectId.isValid(assignTo[0])
        ) {
          throw new Error("Please provide a valid user ID.");
        }

        if (assignTo.length === 1 && assignTo[0] === creatorId) {
          throw new Error("You cannot assign the task to yourself.");
        }
        assignToId = assignTo[0];
      } else {
        throw new Error(
          "AssignTo must be a string or an array containing one ID."
        );
      }
      req.assignTo = assignToId;
      return true;
    })
    .run(req);

  await body("checklist")
    .notEmpty()
    .withMessage("Checklist is required!")
    .isArray()
    .withMessage("Checklist must be an array!")
    .custom((checklist) => {
      if (!Array.isArray(checklist)) {
        return true;
      }

      if (checklist.length === 0) {
        throw new Error("Checklist cannot be empty!");
      }

      const idSet = new Set();
      checklist.forEach((item) => {
        const itemIdstr = String(item.itemId).trim();
        // const isValidId = /^[^a-zA-Z0-9]/.test(itemIdstr);
        // console.log("itemId", item, isValidId);

        if (!itemIdstr || itemIdstr === "" || /^[^a-zA-Z0-9]/.test(itemIdstr)) {
          throw new Error(
            "Checklist items must have valid id and must not start with special characters!"
          );
        }
        // console.log(idSet,item)
        if (idSet.has(item.itemId)) {
          throw new Error("Checklist item IDs must be unique within the task.");
        }
        idSet.add(item.itemId);

        if (!item.text || item.text.trim() === "") {
          throw new Error("Checklist items must have a text.");
        }
      });

      return true;
    })
    .run(req);

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: error.array()[0].msg,
    });
  }
  next();
};

module.exports = validateTask;
