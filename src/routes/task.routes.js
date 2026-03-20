import { createTask } from "../controllers/task.controller";
import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/").post(verifyToken, createTask)
router.route("/").put(verifyToken, updateTask)
router.route("/").delete(verifyToken, deleteTask)
export default router;