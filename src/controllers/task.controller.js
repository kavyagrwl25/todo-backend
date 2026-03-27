import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/task.model.js";
import { isValidDesc, isValidPriority, isValidTitle } from "../utils/validator.js";
// this controller is responsible for handling all the task related operations such as creating a task, getting all tasks, updating a task and deleting a task. it will interact with the Task model to perform these operations and send appropriate responses back to the client.


const createTask = asyncHandler(async (req, res) => {
    // get task details from frontend
    // validate task details
    // create task object / create task entry in database
    // send response to frontend

    const { title, description, priority, dueDate } = req.body;
    if(!isValidTitle(title)){
        throw new ApiError(400, "Either title is undefined or too long")
    }
    if(!isValidDesc(description)){
        throw new ApiError(400, "Description range is 5 to 300 characters.")
    }

    /* const validPriorities = ["Low", "Medium", "High"];
    if (priority && !validPriorities.includes(priority)) {
        throw new ApiError(400, "Invalid priority value");
    } */
   if(!isValidPriority(priority)){
        throw new ApiError(400, "Invalid priority value");
   }
    const dueDateObj = new Date(dueDate);
    if (dueDate && isNaN(dueDateObj.getTime())) {
        throw new ApiError(400, "Invalid due date");
    }

    const existingTask = await Task.findOne({ title, userId: req.user._id });
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

    const populatedTask = await Task.findById(task._id).populate("user", "displayName email") //populate is a mongoose method to populate the user field with the displayName and email of the user who created the task


    return res
    .status(201)
    .json(new ApiResponse(201, populatedTask, "Task created successfully"))
});


// similarly, we will implement the other controllers for getting all tasks, updating a task and deleting a task. we will also use asyncHandler to handle any errors that may occur during the execution of these controllers and send appropriate responses back to the client.


//update task

    // 1. get title, description, priority from from req.body && get task from req.param
    // 2. validate each entity
    // 3. use findByIdAndUpdate and update the entities in the particular user
    // 4. return the res
const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const { title, description, priority } = req.body
    if(!isValidTitle(title)){
        throw new ApiError(400, "Either title is undefined or too long")
    }
    if(!isValidDesc(description)){
        throw new ApiError(400, "Description range is 5 to 300 characters.")
    }
    if(!isValidPriority(priority)){
        throw new ApiError(400, "Invalid priority value");
   }
    const updatedTask = await Task.findOneAndUpdate( { _id : taskId, userId: req.user._id },//both cond needs to be true, (query obj) 
        {
            $set : {
                title : title, 
                description : description, 
                priority : priority
            }
        }, {
            new : true,
            runValidators: true
        }
    )
    if (!updatedTask) {
        throw new ApiError(404, "Task not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task Updated Successfully"))
})


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
    
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId: req.user._id })
    .populate("user", "displayName email");

    if (!deletedTask) {
        throw new ApiError(404, "Task not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, deletedTask, "Task deleted successfully"))
});


// To show each task on the dashboard
const getAllTasks = asyncHandler(async(req, res) => {
    // 1. get logged-in user from req.user
    // 2. find all tasks whose user matches req.user._id
    // 3. use find method in db, it will return all documents related to task model with each field
    // 3. store all returned task documents in a variable
    // 4. return them in response
    const userId = req.user._id    // or const { _id : userId } = req.user    (here we are destructuring it from req.user object)
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 })   // for latest tasks should display first
    return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"))
})


export { createTask, updateTask, deleteTask, getAllTasks };


// createTask       :done
// updateTask       :done
// deleteTask       :done
// getAllTasks
// getTaskById
// toggleTaskCompletion