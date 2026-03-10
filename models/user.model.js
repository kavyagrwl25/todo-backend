import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    
    email : {
        type: String,
        required: true,
        unique: true
    },

    passwordHash: {
        type: String,
        required: true
    },

    displayName: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    lastLoginAt: {
        type: Date
    }

});

export const User = mongoose.model("User", userSchema);