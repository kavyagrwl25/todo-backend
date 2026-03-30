import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({                                  // Enable CORS for all routes 
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))

app.use(cookieParser())


import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users", userRouter)

import taskRouter from "./routes/task.routes.js"
app.use("/api/v1/tasks", taskRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        data: null,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
});

export default app;