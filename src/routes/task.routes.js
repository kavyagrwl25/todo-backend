import { Router } from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTaskCompletion
} from "../controllers/task.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// Apply auth to all routes
router.use(verifyToken);

// Base routes
router.route("/")
  .post(createTask)
  .get(getAllTasks);

// Single task routes
router.route("/:taskId")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

// Special action route
router.patch("/:taskId/completion", updateTaskCompletion);

export default router;