import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },

    dueDate: {
        type: Date
    },

    isCompleted: {
        type: Boolean,
        default: false
    }
},

    {timestamps: true}

);

export const Task = mongoose.model("Task", taskSchema);