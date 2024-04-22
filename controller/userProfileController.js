import joiPkg from "joi";
const { ValidationError } = joiPkg;
import { v2 as cloudinary } from "cloudinary";

import db from "../db/database.js";
import uploader from "../uploads/uploader.js";
import extractPublicID from "../uploads/extract_Public_ID.js";



export const getProfileData = async (req, res, next) => {
  const { id, email, role } = req.user;


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

      userProfileData = data[0];
      console.log(data);
    }

    res.status(200).json({
      success: true,
      userData: userProfileData,
      message: "Successfully get user data",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed, try again.",
    });
  }
};



export const editProfileData = async (req, res, next) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const role = req.user.role;
  const { name, email, country_code, phone_no, address } = req.body;

  let image_path = null;
  if (req.files && req.files.image) {
    image_path = req.files.image[0].path;
  }

  console.log("files: ", req.files);
  console.log("body: ", req.body);

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
        const publicID = await extractPublicID(data[0].image || "");


        const result = await cloudinary.api
          .delete_resources([publicID || ""], {
            type: "upload",
            resource_type: "image",
          })
          .catch((err) => {
            console.log(err);
          });


        imageResult = await uploader(image_path);
        const [image_url = ""] = imageResult ?? [];

        console.log("image_url: ", image_url);

        if (image_url) {
          await db.execute("UPDATE users SET image = ? WHERE id = ?", [
            image_url,
            userId,
          ]);
        }
      }

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


      let business_license_image_path = null;
      if (req.files && req.files.businessLicenseImage) {
        business_license_image_path = req.files.businessLicenseImage[0].path;
      }

      let driver_license_image_path = null;
      if (req.files && req.files.driverLicenseImage) {
        driver_license_image_path = req.files.driverLicenseImage[0].path;
      }

      await db.execute(sql, values);

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

      const [data, field] = await db.execute(
        `SELECT image, business_license_image, driver_license_image 
        FROM users
        join userDetails on users.id = userDetails.user_id 
        WHERE users.id = ?`,
        [userId]
      );

      let imageResult;

      if (image_path != null) {
        const publicID = await extractPublicID(data[0].image || "");

        const result = await cloudinary.api
          .delete_resources([publicID || ""], {
            type: "upload",
            resource_type: "image",
          })
          .catch((err) => {
            console.log(err);
          });

        imageResult = await uploader(image_path);
        const [image_url = ""] = imageResult ?? [];
        
        console.log("image_url: ", image_url);

        await db.execute("UPDATE users SET image = ? WHERE id = ?", [
          image_url,
          userId,
        ]);

        
      }

      if (business_license_image_path != null) {
        const bl_publicId = await extractPublicID(
          data[0].business_license_image || ""
        );

        const result = await cloudinary.api
          .delete_resources([bl_publicId || ""], {
            type: "upload",
            resource_type: "image",
          })
          .catch((err) => {
            console.log(err);
          });

        imageResult = await uploader(business_license_image_path);
        const [bl_img_url = ""] = imageResult ?? [];

        console.log("bl_img_url: ", bl_img_url);

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
        const dl_publicId = await extractPublicID(
          data[0].driver_license_image || ""
        );

        const result = await cloudinary.api
          .delete_resources([dl_publicId || ""], {
            type: "upload",
            resource_type: "image",
          })
          .catch((err) => {
            console.log(err);
          });

        imageResult = await uploader(driver_license_image_path);
        const [dl_img_url = ""] = imageResult ?? [];

        console.log("dl_img_url: ", dl_img_url);

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


export const getAllAddress = async (req, res, next) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const role = req.user.role;

  try {
    const [data, field] = await db.execute(
      `SELECT * FROM addresses WHERE user_id = ? AND is_deleted = ?`,
      [userId, true]
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
        data: data,
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


export const setAddress = async (req, res, next) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const role = req.user.role;
  const { label, address } = req.body;

  console.log("body:", req.body);

  try {

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


export const editAddress = async (req, res, next) => {
  const userId = req.user.id;
  const addressId = req.params.addressId;
  const { label, address } = req.body;
  console.log("body:", req.body);


  try {
    await db.execute(
      `UPDATE addresses
      SET
        label = ?,
        address = ?
      WHERE
        id = ? AND user_id = ?`,
      [label, address, addressId, userId]
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


export const deleteAddress = async (req, res, next) => {
  const userId = req.user.id;
  const addressId = req.params.addressId;

  try {
    await db.execute(`
      UPDATE addresses
      SET
        is_deleted = ?
      WHERE
        id = ? AND user_id = ?`, [false, addressId, userId]);

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



export const getFavoriteCaterers = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const [favoriteCaterer] = await db.execute(
      `SELECT
          users.id,
          users.name,
          users.image,
          COALESCE(ROUND(avg(ratings.rating_value), 1), 0) AS rating,
          userDetails.address
      FROM
          users
      INNER JOIN 
          favorites on users.id = favorites.caterer_id
      LEFT JOIN 
          userDetails on users.id = userDetails.user_id
      LEFT JOIN
          ratings ON users.id = ratings.user_id
      WHERE
          favorites.user_id = ?
      GROUP BY
          users.id`,
      [userId]
    );

    if (favoriteCaterer.length > 0) {
      res.status(200).json({
        success: true,
        message: "Successfully retrieved user's addresses",
        data: favoriteCaterer,
      });
    } else {
      res.status(404).json({
        success: true,
        data: favoriteCaterer,
        message: "User has no favorite caterer.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to retrieve user's favorite caterer.",
    });
  }
};


export const addFavoriteCaterer = async (req, res, next) => {
  const userId = req.user.id;
  const catererId = req.body.catererId;

  console.log("body:", req.body);


  try {
    if (!catererId) {
      return res.status(400).json({
        success: false,
        message: "Please provide catererId required.",
      });
    }

    const [existingFavorite] = await db.execute(
      "SELECT * FROM favorites WHERE user_id = ? AND caterer_id = ?",
      [userId, catererId]
    );

    if (existingFavorite.length) {
      return res.status(409).json({
        success: false,
        message: "Caterer is already in the favorites list.",
      });
    }

    const [favoriteCaterer] = await db.execute(
      `INSERT INTO favorites(user_id, caterer_id) VALUES (?, ?)`,
      [userId, catererId]
    );

    console.log(favoriteCaterer);

    res.status(200).json({
      success: true,
      message: "Favorite caterer added successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to delete address, Try again.",
    });
  }
};


export const removeFavoriteCaterer = async (req, res, next) => {
  const userId = req.user.id;
  const favoriteId = req.params.favoriteId;

  try {
    const [result] = await db.execute(
      "DELETE FROM favorites WHERE id = ? AND user_id = ?",
      [favoriteId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Favorite caterer not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Favorite caterer removed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove favorite caterer.",
      error: error.message,
    });
  }
};

