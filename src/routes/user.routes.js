import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshTokens, changePassword, getCurrentUser, updateUserDetails } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/refresh-tokens", refreshTokens)
router.post("/logout", verifyToken, logoutUser)

router.get("/me", verifyToken, getCurrentUser)
router.patch("/me", verifyToken, updateUserDetails)
router.patch("/me/password", verifyToken, changePassword)

  

export default router;      //as the default export of this module, allowing it to be imported without using curly braces in other files. and                           also it can be imported with any name in other files, but it's a common convention to use the same name as the file (userRouter) for clarity.
