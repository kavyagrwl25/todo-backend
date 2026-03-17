import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError(500, "Failed to generate tokens");   
    }
};

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

    const emailRegex = /^\S+@\S+\.\S+$/;

    if(!emailRegex.test(email)){
        throw new ApiError(400,"Invalid email format")
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
        httpOnly: true
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
        httpOnly: true
    
    };

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
    
})
    

export { registerUser, loginUser, logoutUser }