import { v2 as cloudinary } from "cloudinary"
import { log } from "console";
import fs from "fs"
import { ApiError } from "./ApiError";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null
        }
        else {
            //upload the file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })

            console.log("the response is:", response);

            //file has been uploaded successfully
            // console.log("file is uploaded on cloudinary",response.url);
            fs.unlinkSync(localFilePath)
            return response;
        }
    } catch (error) {
        fs.unlinkSync(localFilePath);
        //remove the locally saved temporary file as the upload operation got failed 
        return null;
    }
}

const deleteOnCloudinary = async (localPath) => {
    try {
        const parts = localPath.split('/')
        const publicidwithext = parts.slice(parts.indexof('upload') + 1).join('/')
        const publicId = publicidwithext.replace(/\.[^/.]+$/, "")

        const result = await cloudinary.uploader.destroy(publicId)
        if (!result) {
            throw new ApiError(500, "can not delete file from the cloudinary")
        }
        return result;
    } catch (error) {
        throw new ApiError(500,"cloudinary deletion is failed")
    }
}

export { uploadOnCloudinary,deleteOnCloudinary}

