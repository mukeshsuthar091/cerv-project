const extractPublicID = (imageUrl) => {

  const regex = /\/v\d+\/(.*\/.*\..*)$/;
  const match = imageUrl.match(regex);
  
  if (match && match[1]) {
    let publicIdWithExtension = match[1];
    // Remove file extension
    const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf("."));
    console.log("Public ID:", publicId);
    
    return publicId;

  } else {
    console.log("Failed to extract public ID from URL");
    // return null;
  }
};

export default extractPublicID;
