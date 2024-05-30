import Task from "@src/models/Task";
import mongoose, { Types } from "mongoose";
import { Request, Response } from "express";
import User from "@src/models/User";

async function create(req: Request, res: Response) {
  try {
    if (!req.body) {
      res.status(400).json({ error: "task data should not be empty" });
      return;
    }

    const { name, description, status, userId }: CreateTaskRequest = req.body;
    if (!name) {
      res.status(400).json({ error: "name should not be empty" });
      return;
    }
    if (!description) {
      res.status(400).json({ error: "description should not be empty" });
      return;
    }
    if (!status) {
      res.status(400).json({ error: "status should not be empty" });
      return;
    }

    const validStatuses = ["pending", "working", "review", "done", "archive"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "invalid status" });
      return;
    }

    // Convert userId string to ObjectId
    let parsedUserId: Types.ObjectId | null = null;
    if (userId) {
      if (!mongoose.isValidObjectId(userId)) {
        res.status(400).json({ error: "invalid user id" });
        return;
      }
      const user = await User.findById(userId);
      if (!user) {
        res.status(400).json({ error: "user not found" });
        return;
      }

      parsedUserId = new Types.ObjectId(userId);
    }

    const now = new Date();
    const newTask = new Task({
      name,
      description,
      status,
      userId: parsedUserId,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });
    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:`", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "task id should not be empty" });
      return;
    }

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ error: "invalid task id" });
      return;
    }

    const tasks = await Task.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: false,
    }).select("-isDeleted");
    if (!tasks) {
      res.status(404).json({ error: "task not found" });
      return;
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
}

interface ListTasksFilter {
  isDeleted: boolean;
  userId?: string;
  status?: string;
}

async function list(req: Request, res: Response) {
  try {
    let filter: ListTasksFilter = { isDeleted: false };
    const userId = req.query.userId as string;
    if (userId) {
      if (!mongoose.isValidObjectId(userId)) {
        res.status(400).json({ error: "invalid user id" });
        return;
      }

      filter = { ...filter, userId: userId };
    }
    const status = req.query.status as string;
    if (status) filter = { ...filter, status: status };

    const sortField = req.query.sortField as string;
    const sortOrder = req.query.sortOrder as string;

    let sort: any = { createdAt: -1 };
    if (sortField) {
      const validSortFields = ["createdAt", "updatedAt"];
      if (validSortFields.includes(sortField)) {
        sort = { [sortField]: sortOrder === "desc" ? -1 : 1 };
      }
    }

    const tasks = await Task.find(filter).sort(sort);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
}

async function updateById(req: Request, res: Response) {
  try {
    const taskId = req.params.id;
    const update: UpdateTasksRequest = req.body;
    const task = await Task.findOne({ _id: taskId, isDeleted: false }).select(
      "-isDeleted"
    );

    if (!task) {
      res.status(404).json({ error: "task not found" });
      return;
    }

    task.userId = null;
    if (update.userId) {
      if (!mongoose.isValidObjectId(update.userId)) {
        res.status(400).json({ error: "invalid user id" });
        return;
      }
      const user = await User.findById(update.userId);
      if (!user) {
        res.status(400).json({ error: "user not found" });
        return;
      }

      task.userId = new Types.ObjectId(update.userId);
    }

    update.name ? (task.name = update.name) : task.name;
    update.description
      ? (task.description = update.description)
      : task.description;

    if (update.status === "done" && task.status !== "archive") {
      res.status(400).json({
        error: "task status can only be changed to archive when it is done",
      });
      return;
    }
    update.status ? (task.description = update.status) : task.status;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function softDeleteById(req: Request, res: Response) {
  try {
    const taskId = req.params.id;
    if (!mongoose.isValidObjectId(taskId)) {
      res.status(400).json({ error: "invalid task id" });
      return;
    }

    const task = await Task.findOne({ _id: taskId, isDeleted: false }).select(
      "-isDeleted"
    );
    if (!task) {
      res.status(404).json({ error: "task not found" });
      return;
    }

    task.isDeleted = true;
    await task.save();
    res.json({ message: "delete task successfully" });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
}

export default {
  create,
  getById,
  list,
  updateById,
  softDeleteById,
} as const;
