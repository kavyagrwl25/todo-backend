import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { isValidEmail } from "../utils/validator.js";


// Helper function to generate access and refresh tokens

const generateAccessAndRefreshTokens = async (userId) => {          // bhai ye function baar baar use hoga to generate tokens, isliye isse alag se ek helper function bana diya hai, jisse hum login aur refresh token dono jagah use kar sakte hain. is function me userId pass karna hoga, jisse hum user ko identify kar sake aur uske liye tokens generate kar sake. 
    try {
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(404,"User not found")
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError(500, error.message || "Failed to generate tokens");   
    }
};

// Register user

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validate user details
    // check if user already exists in database
    // create user object / create user entry in database
    // create user in database
    // send response to frontend

    const {displayName, email, userPassword} = req.body;  
    if(!displayName?.trim() || !email?.trim() || !userPassword?.trim()){
        throw new ApiError(400, "All fields are required");
    }

    /* const emailRegex = /^\S+@\S+\.\S+$/;

    if(!emailRegex.test(email)){
        throw new ApiError(400,"Invalid email format")
    } */
    if(!isValidEmail(email)){
        throw new ApiError(400, "Invalid email format")
    }

    if (userPassword.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long");
    }

    const userExists = await User.findOne({
        $or: [{ email }, { displayName }]
    })

    if (userExists) {
        throw new ApiError(409, "User with email or Username already exists");
    }

    const user = await User.create({
        displayName, 
        email,
        userPassword
    })

    const createdUser = await User.findById(user._id).select("-userPassword -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Failed to create user");
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"));
})

// Login user

const loginUser = asyncHandler(async (req, res) => {
    const { displayName, userPassword } = req.body;

    const validUser = await User.findOne({ displayName });
    if (!validUser) throw new ApiError(401, "User does not exist!!");

    const passwordMatch = await validUser.isPasswordCorrect(userPassword);
    if (!passwordMatch) throw new ApiError(401, "Invalid credentials");


    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(validUser._id);

    // Get user without sensitive fields
    const loggedInUser = await User.findById(validUser._id).select("-userPassword -refreshToken");

    // Cookie options
    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken
        }, "Login successful"));
});

// Logout user

const logoutUser = asyncHandler(async (req, res) => {

    // need user id, get if from request object
    // need to remove its refresh token from db, use findByIdAndUpdate
    // need to remove cookies to prevent further logins without password

    await User.findByIdAndUpdate(
        req.user._id,               // i have access to req.user because of verifyToken middleware, which attaches the user object to the       request after verifying the access token. This allows me to identify which user is making the logout request and perform the necessary actions to log them out securely.
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    
    };

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
    
})

// Refresh expired tokens

const refreshTokens = asyncHandler(async (req, res) => {
    
        const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
        if(!incomingRefreshToken){
            throw new ApiError(401, "Refresh token is required");
        }
        try {
        
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id)
        if(!user){
            throw new ApiError(401, "No user found!!")
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Token is expired or invalid!!")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await generateAccessAndRefreshTokens(user._id)  //generateAccessAndRefreshTokens function will generate new tokens and also update the refresh token in the database for the user. it takes userId as an argument, which it uses to find the user and generate tokens for that user.
    
        return res
        .status(202)
        .cookie("accessToken", newAccessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(new ApiResponse(
            200, {
                newAccessToken,
                newRefreshToken
            }, "Tokens refreshed succesfully"
        )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token")
    }
})


const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id) 
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400, "Incorrect Password")
    }
    if(newPassword.length < 6){
        throw new ApiError(400,"Password must be at least 6 characters")
    }
    user.userPassword = newPassword
    await user.save({validateBeforeSave: false})
    return res
    .status(200,)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})


const updateUserDetails = asyncHandler(async (req, res) => {
    const { displayName, email } = req.body
    if(!displayName?.trim() || !email?.trim()){
        throw new ApiError(400, "All fields are required")
    }
    if(!isValidEmail(email)){
        throw new ApiError(400, "Invalid email format")
    }
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                displayName: displayName.trim(),
                email: email.trim()
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"))
})

    



export { registerUser, loginUser, logoutUser, refreshTokens, changePassword, getCurrentUser, updateUserDetails }