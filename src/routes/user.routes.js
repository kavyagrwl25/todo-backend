import { Router } from "express";
import {registerUser, loginUser, logoutUser, refreshTokens } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/register", registerUser)   //registerUser will be added here when implemented
router.post("/login", loginUser)   //loginUser will be added here when implemented

// secured route for logout
router.post("/logout", verifyToken, logoutUser)   //logoutUser will be added here when implemented
router.route("/refresh-tokens").post(refreshTokens)   //refreshTokens will be added here when implemented, just another syntax


export default router;      //as the default export of this module, allowing it to be imported without using curly braces in other files. and                           also it can be imported with any name in other files, but it's a common convention to use the same name as the file (userRouter) for clarity.