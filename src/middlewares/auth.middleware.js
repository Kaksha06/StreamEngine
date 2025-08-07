import { User } from '../models/user.model.js';
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';


export const verifyJWT = asyncHandler(async (req, res, next) => {
    // optional add kiya if accesstoken not avlbl through cookies

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        //console.log("Cookies:", req.cookies);
        // console.log("Authorization Header:", req.header("Authorization"));
        // console.log("Token Found:", token);


        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        const { verify } = jwt;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user;
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access")
    }
})
