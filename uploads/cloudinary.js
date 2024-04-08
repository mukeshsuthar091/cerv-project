import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ----------- cloudinary connection -------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_DATABASE_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploads = async(filePath) => {
  try{
    const result = await cloudinary.uploader.upload(filePath, {folder: "cerv-project-images"});
    // console.log(result);
    return result;
  }catch(err){
    console.log(err.message);
  }
}

export default uploads;
