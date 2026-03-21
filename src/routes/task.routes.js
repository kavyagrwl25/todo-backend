import { Router } from "express";
import { createTask, deleteTask } from "../controllers/task.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/").post(verifyToken, createTask)
/* router.route("/").put(verifyToken, updateTask) */
router.route("/:taskId").delete(verifyToken, deleteTask)
export default router;