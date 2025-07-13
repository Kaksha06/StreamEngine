import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { response } from "express"
import { log } from "console"


const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message:"ok"
    // })

    //get the details from frontend
    //validation-not empty
    //check if the user already exists - username,email
    //check for images, check for avatar
    //upload them to cloudinary,avatar(and again check for avatar)
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return response, else return error 


    const { fullName, email, username, password } = req.body
    console.log("email:", email);
    console.log("all the data:", req.body);


    // if(fullName===""){
    //     throw new ApiError(400,"fullname is required")
    // } instead of doing this we will put all details together 

    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist")
    }

    console.log("FILES RECEIVED:", req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;



    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url, //idhar validated hai as we have checked using if condition
        coverImage: coverImage?.url || "", //idhar hamne validate nahi kiya hai ki coverimage hai hi
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" //jo nahi chahiye uske aage negative sign
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

export { registerUser }