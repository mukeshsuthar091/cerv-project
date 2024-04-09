import joiPkg from "joi";
const { ValidationError } = joiPkg;
import { v2 as cloudinary } from "cloudinary";

import db from "../db/database.js";
import uploads from "../uploads/cloudinary.js";
import extractPublicID from "../uploads/extract_Public_ID.js";

export const getProfileData = async (req, res, next) => {
  const { id, email, role } = req.user;

  // console.log(id, email, role);

  try {
    let userProfileData;

    if (role === 2) {
      let [data, field] = await db.execute(
        `SELECT 
            users.id, 
            users.name, 
            users.email, 
            users.phone, 
              CASE
                  WHEN addresses.address IS NOT NULL THEN addresses.address
                  ELSE NULL
              END AS address
        FROM 
            users
        LEFT JOIN 
            addresses ON users.id = addresses.user_id and addresses.is_default = 1
        WHERE 
        users.id = ? AND users.role = ?`,
        [id, role]
      );

      userProfileData = data[0];
      console.log(userProfileData);
    }

    if (role === 1) {
      let [data, field] = await db.execute(
        `select users.id,
            name, 
            email, 
            image, 
            country_code, 
            phone, 
            business_license_number, 
            business_license_image, 
            address, bio, order_type, 
            distance_and_fee, 
            food_category,
            driver_name,
            driver_license_image, 
            driver_license_number
        from users
        join userDetails on users.id = userDetails.user_id
        where users.id = ? AND users.role = ?`,
        [id, role]
      );

      // userProfileData = data[0];
      console.log(data);
    }

    res.status(200).json({
      success: true,
      userData: userProfileData,
      message: "Successfully get user data",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed, try again.",
    });
  }
};

// ------ Image upload for registration ------

const uploadImage = async (img1_path, img2_path) => {
  const urls = [];

  const business_license_image_newPath = await uploads(img1_path);
  const driver_license_image_newPath = await uploads(img2_path);

  urls.push(business_license_image_newPath.secure_url);
  urls.push(driver_license_image_newPath.secure_url);

  return urls;
};

export const editProfileData = async (req, res, next) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const role = req.user.role;
  console.log(userId, userEmail, role);

  // console.log(req.body);
  const { name, email, country_code, phone_no, address } = req.body;
  
  try {
    const [user, field] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (user.length > 0) {
      return res.status(500).json({
        success: false,
        message: "Email address is already in use by another user. Please choose a different email.",
      });
    }


    // common query for both
    let sql = `
        UPDATE users
        SET 
            name = ?,
            email = ?,
            country_code = ?,
            phone = ?
        WHERE
            id = ?;
    `;

    let values = [name, email, country_code, phone_no, userId];

    if (role === 2) {
      // updating user data (customer) and address
      await db.execute(sql, values);
      await db.execute(
        `UPDATE addresses
        SET 
        address = ?
        WHERE
        user_id = ?`,
        [address, userId]
      );
      console.log(name, email, country_code, phone_no, address);
    }

    if (role === 1) {
      const {
        businessLicenseNum,
        address,
        bio,
        orderType,
        distanceAndFeel,
        foodCategory,
        driverName,
        driverLicenseNumber,
      } = req.body;

      const business_license_image_path =
        (req.files &&
          req.files.businessLicenseImage &&
          req.files.businessLicenseImage[0] &&
          req.files.businessLicenseImage[0].path) ||
        null;
      const driver_license_image_path =
        (req.files &&
          req.files.driverLicenseImage &&
          req.files.driverLicenseImage[0] &&
          req.files.driverLicenseImage[0].path) ||
        null;

      // finding images to update
      const [data, field] = await db.execute(
        `SELECT business_license_image, driver_license_image FROM userDetails WHERE user_id = ?`,
        [userId]
      );

      console.log(data);
      const bl_publicId = extractPublicID(data[0].business_license_image);
      const dl_publicId = extractPublicID(data[0].driver_license_image);

      console.log(bl_publicId);
      console.log(dl_publicId);

      // image deleting from cloudinary
      const result = await cloudinary.api
        .delete_resources([bl_publicId, dl_publicId], {
          type: "upload",
          resource_type: "image",
        })
        .catch((err) => {
          console.log(err);
        });

      console.log("result= ", result);

      // image storing into cloudinary
      let imageResult;
      if (
        business_license_image_path != null &&
        driver_license_image_path != null
      ) {
        imageResult = await uploadImage(
          business_license_image_path,
          driver_license_image_path
        );
      }
      const [bl_img_url = "", dl_img_url = ""] = imageResult ?? [];

      console.log(bl_img_url, dl_img_url)

      // updating user data (caterer)
      await db.execute(sql, values);

      // updating additional data of user(caterer)
      sql = `
          UPDATE userDetails
          SET 
            business_license_number = ?,
              business_license_image = ?,
              address = ?,
              bio = ?,
              order_type = ?,
              distance_and_fee = ?,
              food_category = ?,
              driver_name = ?,
              driver_license_number = ?,
              driver_license_image = ?
          WHERE 
            user_id = ? `;

      values = [
        businessLicenseNum,
        bl_img_url,
        address,
        bio,
        orderType,
        distanceAndFeel,
        foodCategory,
        driverName,
        driverLicenseNumber,
        dl_img_url,
        userId
      ];

      await db.execute(sql, values);
    }

    res.status(200).json({
      success: true,
      message: "Update Successfully done.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update Failed, try again.",
    });
  }
};
