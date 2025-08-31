import { v2 as cloudinary } from "cloudinary"
import { log } from "console";
import fs from "fs"
import { ApiError } from "./ApiError.js";


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

const deleteOnCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) {
      throw new ApiError(400, "File URL is required");
    }

    const parts = fileUrl.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) {
      throw new ApiError(400, "Invalid Cloudinary URL");
    }

    const publicIdWithExt = parts.slice(uploadIndex + 1).join('/');
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // Remove file extension

    const result = await cloudinary.uploader.destroy(publicId);

    if (!result || (result.result !== "ok" && result.result !== "not found")) {
      throw new ApiError(500, "Cannot delete file from Cloudinary");
    }

    return result;
  } catch (error) {
    throw new ApiError(500, "Cloudinary deletion failed");
  }
};
export { uploadOnCloudinary, deleteOnCloudinary };

