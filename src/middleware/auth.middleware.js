import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";


// middleware function to verify access token and protect routes
// 1. get token from request header or cookies
// 2. verify token using jwt.verify method
// 3. if valid, attach user to request object and call next()
// 4. if invalid, throw an error with appropriate message and status code

export const verifyToken = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            throw new ApiError(401, "Unauthorized");
        }
// verify token and attach user to req object
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-userPassword -refreshToken");
        if(!user){
            throw new ApiError(401, "Invalid access token");
        }
        req.user = user;     // saved this user in request object, now i can use req to get id of user inside logout controller
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid access token");     
    }
})