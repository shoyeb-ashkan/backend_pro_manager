const Task = require("../models/Task");
const moment = require("moment");
const getAllTasks = async (req, res) => {
  try {
    // console.log(req)
    const { range } = req.query;
    const userId = req.userId;

    let dateRange = {};
    const taskRange = ["today", "week", "month"];

    if (range && !taskRange.includes(range)) {
      return res.status(400).json({
        error: true,
        message: `Invalid range provided. Valid range are: ${taskRange.join(
          ", "
        )}`,
      });
    }

    switch (range) {
      case "today":
        dateRange = {
          $gte: moment().startOf("day").toDate(),
          $lte: moment().endOf("day").toDate(),
        };
        break;
      case "week":
        dateRange = {
          $gte: moment().startOf("isoWeek").toDate(),
          $lte: moment().endOf("isoWeek").toDate(),
        };
        break;
      case "month":
        dateRange = {
          $gte: moment().startOf("month").toDate(),
          $lte: moment().endOf("month").toDate(),
        };
        break;
      default:
        break;
    }

    const query = {
      $and: [
        {
          $or: [{ assignTo: userId }, { createdBy: userId }],
        },
        {
          $or: [
            {
              dueDate: { $exists: false },
            },
            { dueDate: null },
            ...(range ? [{ dueDate: dateRange }] : []),
          ],
        },
      ],
    };

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .select("-__v -updatedAt");

    return res.status(200).json({
      success: true,
      data: tasks,
      message: `All tasks${
        !!range ? ` for ${range}` : ""
      } fetched successfully`,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res
      .status(500)
      .json({ error: true, message: "Error fetching tasks:" });
  }
};

module.exports = getAllTasks;
