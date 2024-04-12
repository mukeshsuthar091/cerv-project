import uploads from "../uploads/cloudinary.js";

const uploader = async (...imgs) => {
  const urls = [];
  
  for (let img of imgs) {
    const img_newPath = await uploads(img);
    // console.log("urls", img_newPath);

    let img_url = (img_newPath && img_newPath.secure_url) || "" 

    urls.push(img_url);
  }
  return urls;
};


export default uploader;