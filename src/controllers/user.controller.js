import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


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

    if (!email.includes("@")) {
    throw new ApiError(400, "Invalid email format");
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


const loginUser = asyncHandler(async (req, res) => {
    // need user username and password
    // will find user through email in database and get its password
    // comparision with hash passowrd
    // if matches generate an access token and refresh token

    const { displayName, userPassword } = req.body;

    const validUser = await User.findOne({displayName});
    if(!validUser){
        throw new ApiError(401, "User does not exist!!");   
    }
    const passwordMatch = await validUser.isPasswordCorrect(userPassword);
    if(!passwordMatch){
        throw new ApiError(401, "Invalid credentials");
    }

    validUser.lastLoginAt = new Date();
    const accessToken = validUser.generateAccessToken();    
    const refreshToken = validUser.generateRefreshToken();
    validUser.refreshToken = refreshToken;
    await validUser.save();
    
    return res.status(200).json(new ApiResponse(200, {
        accessToken,
        refreshToken,
        user: {
            _id: validUser._id,
            email: validUser.email,
            displayName: validUser.displayName
        }
    }))
    
    
})

export { registerUser, loginUser }