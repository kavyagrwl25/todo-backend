import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

userSchema.pre("save", async function() {
    if(!this.isModified("passwordHash")) return;
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
}

export const User = mongoose.model("User", userSchema);