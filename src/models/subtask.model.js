import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema({

    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    isCompleted: {
        type: Boolean,
        default: false
    },

    order: {
        type: Number
    }

});

export const SubTask = mongoose.model("SubTask", subtaskSchema);