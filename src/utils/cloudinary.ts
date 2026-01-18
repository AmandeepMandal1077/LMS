import {
  v2 as cloudinary,
  type UploadApiResponse,
  type UploadApiErrorResponse,
} from "cloudinary";
import { ApiError } from "./apiError.js";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const uploadImage = async (filePath: string): Promise<UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
    });
    console.log(result);
    await fs.promises.unlink(filePath);
    return result as UploadApiResponse;
  } catch (error) {
    console.error("ERROR: ", error);
    throw new ApiError("Failed to upload image", 500);
  }
};

const uploadVideo = async (filePath: string): Promise<UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload_large(filePath, {
      resource_type: "video",
    });
    console.log(result);
    return result as UploadApiResponse;
  } catch (error) {
    console.error("ERROR: ", error);
    throw new ApiError("Failed to upload video", 500);
  }
};

const deleteMedia = async (
  publicId: string,
  type: "image" | "video",
): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
    });
    console.log(result);
    return result;
  } catch (error) {
    console.error("ERROR: ", error);
    throw new ApiError("Failed to delete media", 500);
  }
};

export { uploadImage, uploadVideo, deleteMedia };
