import joiPkg from "joi";
const { ValidationError } = joiPkg;
import { v2 as cloudinary } from "cloudinary";

import db from "../db/database.js";
import uploader from "../uploads/uploader.js";
import extractPublicID from "../uploads/extract_Public_ID.js";

// --------- get profile details -----------

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
      message: "Successfully get user data",
      userData: userProfileData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed, try again.",
    });
  }
};

// ------ Image upload for registration ------

// const uploadImage = async (img1_path, img2_path) => {
//   const urls = [];

//   const business_license_image_newPath = await uploads(img1_path);
//   const driver_license_image_newPath = await uploads(img2_path);

//   urls.push(business_license_image_newPath.secure_url);
//   urls.push(driver_license_image_newPath.secure_url);

//   return urls;
// };

// --------- edit profile details -----------

export const editProfileData = async (req, res, next) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const role = req.user.role;
  const { name, email, country_code, phone_no, address } = req.body;
  const image_path =
    (req.files &&
      req.files.image &&
      req.files.image[0] &&
      req.files.image[0].path) ||
    null;

  try {
    if (userEmail !== email) {
      const [user, field] = await db.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (user.length > 0) {
        return res.status(500).json({
          success: false,
          message:
            "Email address is already in use by another user. Please choose a different email.",
        });
      }
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

    if (role == 2) {
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

      let imageResult;
      if (image_path != null) {
        const [data, field] = await db.execute(
          `SELECT image FROM users WHERE id = ?`,
          [userId]
        );
        const profile_image = extractPublicID(data[0].image);

        // console.log(profile_image);

        const result = await cloudinary.api
          .delete_resources([profile_image], {
            type: "upload",
            resource_type: "image",
          })
          .catch((err) => {
            console.log(err);
          });

        // console.log("result= ", result);

        imageResult = await uploader(image_path);
        const [image_url = ""] = imageResult ?? [];
        // console.log("image_url: ", image_url);

        if (image_url) {
          await db.execute("UPDATE users SET image = ? WHERE id = ?", [
            image_url,
            userId,
          ]);
        }
      }

      // console.log(name, email, country_code, phone_no, address);
    }

    if (role == 1) {
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

      // updating user data (caterer)
      await db.execute(sql, values);

      // updating additional data of user(caterer)
      sql = `
          UPDATE userDetails
          SET
            business_license_number = ?,
              address = ?,
              bio = ?,
              order_type = ?,
              distance_and_fee = ?,
              food_category = ?,
              driver_name = ?,
              driver_license_number = ?
          WHERE
            user_id = ? `;

      values = [
        businessLicenseNum,
        address,
        bio,
        orderType,
        distanceAndFeel,
        foodCategory,
        driverName,
        driverLicenseNumber,
        userId,
      ];

      await db.execute(sql, values);


      // finding images to update
      const [data, field] = await db.execute(
        `SELECT image, business_license_image, driver_license_image 
        FROM users
        join userDetails on users.id = userDetails.user_id 
        WHERE users.id = ?`,
        [userId]
      );

      let imageResult;

      if (image_path != null) {
        const profile_image = extractPublicID(data[0].image);

        // image deleting from cloudinary
        const result = await cloudinary.api
          .delete_resources([profile_image], {
            type: "upload",
            resource_type: "image",
          })
          .catch((err) => {
            console.log(err);
          });

        imageResult = await uploader(image_path);
        const [image_url = ""] = imageResult ?? [];

        await db.execute("UPDATE users SET image = ? WHERE id = ?", [
          image_url,
          userId,
        ]);
      }

      if (business_license_image_path != null) {
        const bl_publicId = extractPublicID(data[0].business_license_image);

        // image deleting from cloudinary
        const result = await cloudinary.api
          .delete_resources([bl_publicId], {
            type: "upload",
            resource_type: "image",
          })
          .catch((err) => {
            console.log(err);
          });

        imageResult = await uploader(business_license_image_path);
        const [bl_img_url = ""] = imageResult ?? [];

        await db.execute(
          `UPDATE userDetails
          SET
              business_license_image = ?
          WHERE
            user_id = ? `,
          [bl_img_url, userId]
        );
      }

      if (driver_license_image_path != null) {
        const dl_publicId = extractPublicID(data[0].driver_license_image);

        // image deleting from cloudinary
        const result = await cloudinary.api
          .delete_resources([dl_publicId], {
            type: "upload",
            resource_type: "image",
          })
          .catch((err) => {
            console.log(err);
          });

        imageResult = await uploader(driver_license_image_path);
        const [dl_img_url = ""] = imageResult ?? [];

        await db.execute(
          `UPDATE userDetails
          SET
              driver_license_image = ?
          WHERE
            user_id = ? `,
          [dl_img_url, userId]
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "Update Successfully done.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Update Failed, try again.",
    });
  }
};

// --------- get all user's address -----------

export const getAllAddress = async (req, res, next) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const role = req.user.role;

  try {
    const [data, field] = await db.execute(
      `SELECT * FROM addresses WHERE user_id = ?`,
      [userId]
    );

    console.log(data);

    if (data.length > 0) {
      res.status(200).json({
        success: true,
        message: "Successfully retrieved user's addresses",
        addresses: data,
      });
    } else {
      res.status(404).json({
        success: true,
        message: "User has no addresses",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to retrieve user's addresses",
    });
  }
};

// --------- set user's address -----------

export const setAddress = async (req, res, next) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const role = req.user.role;
  const { label, address } = req.body;
  console.log(label, address, userEmail, role);

  try {
    // here's a validation code +++++++++

    if (!label || !address) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required data.",
      });
    }

    await db.execute(
      `INSERT INTO addresses(user_id, label, address) VALUES (?, ?, ?)`,
      [userId, label, address]
    );

    console.log(address);

    res.status(200).json({
      success: true,
      message: "Address added successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to add address, Try again.",
    });
  }
};

// --------- edit user's address -----------

export const editAddress = async (req, res, next) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const role = req.user.role;
  const { address_id, label, address } = req.body;
  // city, state, postal_code, country will be add later

  try {
    await db.execute(
      `UPDATE addresses
      SET
        label = ?,
        address = ?
      WHERE
        id = ? AND user_id = ?`,
      [label, address, address_id, userId]
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      error: error.message,
      message: "Failed to update address, Try again.",
    });
  }
};

// --------- delete user's address -----------

export const deleteAddress = async (req, res, next) => {
  const { id, email, role } = req.user;
  const address_id = req.params.address_id;

  // console.log(address_id, userId)
  try {
    await db.execute(`DELETE FROM addresses WHERE id = ?`, [address_id]);

    res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to delete address, Try again.",
    });
  }
};
