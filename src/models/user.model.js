import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    
    email : {
        type: String,
        required: true,
        unique: true
    },

    userPassword: {
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
    },

    refreshToken: String

});

userSchema.pre("save", async function() {
    if(!this.isModified("userPassword")) return;
    this.userPassword = await bcrypt.hash(this.userPassword, 10);
})

userSchema.methods.isPasswordCorrect = async function(password) {   
    return await bcrypt.compare(password, this.userPassword);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        displayName: this.displayName
    }, process.env.ACCESS_TOKEN_SECRET, 
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRET, 
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}

export const User = mongoose.model("User", userSchema);