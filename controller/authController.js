import fs from "fs";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import pkg from "otpless-node-js-auth-sdk";
const { sendOTP, resendOTP, verifyOTP } = pkg;
import joiPkg from "joi";
const { ValidationError } = joiPkg;
import dotenv from "dotenv";

import db from "../db/database.js";
// import upload from "../uploads/multer.js";
import uploader from "../uploads/uploader.js";
import {
  resendOTPValidation,
  sendOtpValidation,
  userChangePasswordValidation,
  userForgetPasswordValidation,
  userLoginValidation,
  userRegisterValidation,
  userResetPasswordValidation,
  verifyOTPValidation,
} from "../validation/authValidation.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.ETHEREAL_MAIL_USERNAME,
    pass: process.env.ETHEREAL_MAIL_PASSWORD,
  },
});

// ------------------------- All APIs -------------------------------

// --------- send OTP API ----------

export const send_OTP = async (req, res, next) => {
  try {
    await sendOtpValidation.validateAsync(req.body);

    // ------- OTP send Code -------
    // const response = await sendOTP(
    //   req.body.country_code + req.body.phone_no.toString(),
    //   "",
    //   "SMS",
    //   "",
    //   "",
    //   600,
    //   4,
    //   process.env.OTPLESS_API_KEY,
    //   process.env.OTPLESS_API_SECRET
    // );
    // const response = await sendOTP(phoneNumber, email, channel, hash, orderId, expiry, otpLength, clientId, clientSecret)

    // console.log(response);

    res.status(200).json({
      orderId: "abcxzy", // response.orderId
      message: "OTP send successfully",
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to send OTP",
    });
  }
};

// --------- resend OTP API ----------

export const resend_OTP = async (req, res, next) => {
  try {
    await resendOTPValidation.validateAsync(req.body);

    // ------ OTP resend code ------
    // const response = await resendOTP(
    //   req.body.orderId,
    //   process.env.OTPLESS_API_KEY,
    //   process.env.OTPLESS_API_SECRET
    // );

    // console.log(response);

    res.status(200).json({
      orderId: "abcxzy", // response.orderId
      message: "OTP resend successfully",
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      error: error.message,
      success: false,
      message: "Failed to resend OTP",
    });
  }
};

// --------- verify OTP ----------

export const verify_OTP = async (req, res, next) => {
  try {
    // await verifyOTPValidation.validateAsync(req.body);

    const { otp, orderId, country_code, phone_no } = req.body;

    // ------- OTP verify Code --------
    // const response = await verifyOTP(
    //   "",
    //   country_code + phone_no.toString(),
    //   orderId,
    //   otp,
    //   process.env.OTPLESS_API_KEY,
    //   process.env.OTPLESS_API_SECRET
    // );
    // console.log("response:", response);

    if (otp === 1234) {
      // response.isOTPVerified
      res.status(200).json({
        success: true,
        isVerify: true,
        message: "OTP Verified successfully",
      });
    } else {
      // If OTP verification fails, return an error response
      res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }
  } catch (error) {
    // if (error instanceof ValidationError) {
    //   return res.status(400).json({
    //     message: error.message,
    //   });
    // }

    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to verify OTP, Please Try again",
    });
  }
};

// --------- register API ----------

export const register = async (req, res, next) => {
  const { name, email, password, country_code, phone_no } = req.body;
  const role = parseInt(req.body.role);
  const image_path =
    (req.files &&
      req.files.image &&
      req.files.image[0] &&
      req.files.image[0].path) ||
    null;

    console.log(req.files);
  let userId;

  try {
    // await userRegisterValidation.validateAsync(req.body);

    const [user, field] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (user.length > 0) {
      return res.status(500).json({
        success: false,
        message: "user is already register with this email.",
      });
    }
    // console.log(user);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    if (role == 2) {
      // 2 = customer

      if (!name || !email || !password || !country_code || !phone_no) {
        return res.status(400).json({
          success: false,
          message: "Please fill in all required data.",
        });
      }

      const [userInsertResult] = await db.execute(
        "INSERT INTO users(name, email, password, country_code, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, hash, country_code, phone_no, role]
      );
      userId = userInsertResult.insertId;

      // ------ Image uploading ------
      if (userId && image_path) {
        let imageResult = await uploader(image_path);
        const [image_url = ""] = imageResult ?? [];
        // console.log("image_url: ", image_url);

        if (image_url) {
          await db.execute("UPDATE users SET image = ? WHERE id = ?", [
            image_url,
            userId,
          ]);
        }
      }

      // return res.status(200).json({
      //   success: true,
      //   message: "User registered successfully",
      // });
    }

    if (role == 1) {
      // 1 = caterer

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

      if (
        !name ||
        !email ||
        !password ||
        !country_code ||
        !phone_no ||
        !businessLicenseNum ||
        !address ||
        !bio ||
        !orderType ||
        !distanceAndFeel ||
        !foodCategory ||
        !driverName ||
        !driverLicenseNumber ||
        !business_license_image_path ||
        !driver_license_image_path
      ) {
        return res.status(400).json({
          success: false,
          message: "Please fill in all required data.",
        });
      }

      // getting user id of user
      const [userInsertResult] = await db.execute(
        "INSERT INTO users(name, email, password, country_code, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, hash, country_code, phone_no, role]
      );
      userId = userInsertResult.insertId;

      // storing user details
      const sql =
        "INSERT INTO userDetails(user_id, business_license_number, address, bio, order_type, distance_and_fee, food_category, driver_name, driver_license_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

      const values = [
        userId,
        businessLicenseNum,
        address,
        bio,
        orderType,
        distanceAndFeel,
        foodCategory,
        driverName,
        driverLicenseNumber,
      ];

      const [user_detail_id] = await db.execute(sql, values);
      let userDetailsId = user_detail_id.insertId;

      console.log("userDetailsId", userDetailsId);

      if (userId && business_license_image_path && driver_license_image_path) {
        // image storing into cloudinary
        let imageResult = await uploader(
          image_path,
          business_license_image_path,
          driver_license_image_path
        );
        // console.log("imageResult", imageResult);
        const [img_url = "", bl_img_url = "", dl_img_url = ""] =
          imageResult ?? [];

        await db.execute("UPDATE users SET image = ? WHERE id = ?", [
          img_url,
          userId,
        ]);

        await db.execute(
          `UPDATE userDetails SET business_license_image = ?, driver_license_image = ? WHERE user_id = ? AND id = ?`,
          [bl_img_url, dl_img_url, userId, userDetailsId]
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    // if (error instanceof ValidationError) {
    //   return res.status(400).json({
    //     message: error.message,
    //   });
    // }

    console.log(error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "registration failed, Try again.",
    });
  }
};

// ----------- login API -------------

export const login = async (req, res, next) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  try {
    await userLoginValidation.validateAsync(req.body);

    const [user, fields] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [userEmail]
    );

    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // if user is exist then check the password or compare the password
    const checkCorrectPassword = await bcrypt.compare(
      userPassword,
      user[0].password
    );

    if (!checkCorrectPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    const { id, email, password, role, ...rest } = user[0];

    const token = jwt.sign(
      { id: id, email: email, role: role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Set the token in the HTTP response header
    res.setHeader("Authorization", `Bearer ${token}`);

    res
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token,
        data: {id, email, role, ...rest },
      });

    // res
    //   .cookie("accessToken", token, {
    //     httpOnly: true,
    //     expires: token.expiresIn,
    //   })
    //   .status(200)
    //   .json({
    //     success: true,
    //     message: "Login successful",
    //     token,
    //     // id,
    //     // email,
    //     data: {id, email, role, ...rest },
    //     // role,
    //   });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to login",
    });
  }
};

// ------------ change password API ------------

export const changePassword = async (req, res, next) => {
  const user = req.user;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  // console.log(user);
  try {
    await userChangePasswordValidation.validateAsync(req.body);

    const [row, fields] = await db.execute(
      "SELECT * FROM users WHERE id = ? AND role = ? ",
      [user.id, user.role]
    );

    if (!row.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isEqual = await bcrypt.compare(oldPassword, row[0].password);
    console.log(isEqual);
    if (!isEqual) {
      return res.status(401).json({
        success: false,
        message: "Wrong Password",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    const sql = "UPDATE users SET password= ? WHERE id= ? AND role = ?";
    const values = [hash, user.id, user.role];

    await db.execute(sql, values);

    res.status(200).json({
      success: true,
      message: "Password change successfully.",
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to change password.",
    });
  }
};

// ----------- forgot password API -------------

export const forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  // const role = req.body.role;

  try {
    // await userForgetPasswordValidation.validateAsync(req.body);

    const [row, fields] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!row.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = jwt.sign(
      { id: row[0].id, email: email, role: row[0].role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    // const link = `http://localhost:4000/api/v1/auth/reset-password/${row[0].id}/${token}`;
    const link = `https://cerv-project.onrender.com/api/v1/auth/reset-password/${row[0].id}/${token}`;

    // console.log(process.env.ETHEREAL_MAIL_USERNAME);

    transporter
      .sendMail({
        to: email,
        from: "cerv-shop@gmail.com",
        subject: "Reset Password!",
        html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="${link}">link</a> to set a new password.</p>
        `,
      })
      .then((info) => {
        console.log("Message sent : %s", info.messageId);
      });

    res.status(200).json({
      success: true,
      message: "Please check your email for password reset.",
    });
  } catch (error) {
    // if (error instanceof ValidationError) {
    //   return res.status(400).json({
    //     message: error.message,
    //   });
    // }

    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to reset password.",
    });
  }
};

// ---------- reset password API ------------

export const resetPasswordLinkVerify = async (req, res, next) => {
  const userId = req.params.id;
  const token = req.params.token;

  try {
    // await userResetPasswordValidation.validateAsync(req.body);

    const [row, fields] = await db.execute(
      "SELECT * FROM users WHERE id = ? ",
      [userId]
    );

    if (!row.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
    }

    // -------- verifying JWT token --------
    const isVerify = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!isVerify) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        userId: isVerify.id,
        email: isVerify.email,
        role: isVerify.role,
      },
      message: "Verified",
    });
  } catch (error) {
    // if (error instanceof ValidationError) {
    //   return res.status(400).json({
    //     message: error.message,
    //   });
    // }

    res.status(500).json({
      success: false,
      error: error.message,
      message: "Not verified",
    });
  }
};

export const resetPassword = async (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;
  const userId = req.body.userId;

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // const sql = "UPDATE users SET password = ? WHERE id = ? AND email = ?";
    // const values = [hash, userId, email];

    await db.execute(`UPDATE users SET password = ? WHERE email = ?`, [
      hash,
      email,
    ]);

    res.status(200).json({
      success: true,
      message: "Your new password has been created successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to reset password. Please try again.",
    });
  }
};
