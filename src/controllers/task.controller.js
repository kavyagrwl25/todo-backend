import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/task.model.js";
// this controller is responsible for handling all the task related operations such as creating a task, getting all tasks, updating a task and deleting a task. it will interact with the Task model to perform these operations and send appropriate responses back to the client.


// 1. create a task
// 2. get all tasks for a user
// 3. update a task
// 4. delete a task

const createTask = asyncHandler(async (req, res) => {
    // get task details from frontend
    // validate task details
    // create task object / create task entry in database
    // send response to frontend

    const { title, description, priority, dueDate } = req.body;
    if (!title?.trim()) {
        throw new ApiError(400, "Title is required");
    }

    const validPriorities = ["Low", "Medium", "High"];
    if (priority && !validPriorities.includes(priority)) {
        throw new ApiError(400, "Invalid priority value");
    }
    const dueDateObj = new Date(dueDate);
    if (dueDate && isNaN(dueDateObj.getTime())) {
        throw new ApiError(400, "Invalid due date");
    }

    const existingTask = await Task.findOne({ title, user: req.user._id });
    if (existingTask) {
        throw new ApiError(409, "Task with the same title already exists");
    }

    const task = await Task.create({   //create is just a mongoose method to create a new document in the db
        title,
        description,
        priority,
        dueDate,
        user: req.user._id
    });

    const populatedTask = await Task.findById(task._id).populate("user", "displayName email");  //populate is a mongoose method to populate the user field with the displayName and email of the user who created the task


    return res.status(201).json(new ApiResponse(201, populatedTask, "Task created successfully"));
});


// similarly, we will implement the other controllers for getting all tasks, updating a task and deleting a task. we will also use asyncHandler to handle any errors that may occur during the execution of these controllers and send appropriate responses back to the client.

// delete task

const deleteTask = asyncHandler(async (req, res) => {
    // get task ID from URL parameters (req.params  or req.query)
    // verify token
    // search for the task in the database using the task ID and user ID from the token
    // if task not found, send 404 response
    // if task found, delete the task from the database
    // send response to frontend

    const { taskId } = req.params;
    if (!taskId?.trim()) {
        throw new ApiError(400, "Task ID is required");
    }
    
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, user: req.user._id })
    .populate("user", "displayName email");

    if (!deletedTask) {
        throw new ApiError(404, "Task not found");
    }

    return res.status(200).json(new ApiResponse(200, deletedTask, "Task deleted successfully"));
});

export { createTask, deleteTask };