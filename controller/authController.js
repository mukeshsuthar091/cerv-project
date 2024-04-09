import fs from "fs";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import pkg from "otpless-node-js-auth-sdk";
const { sendOTP, resendOTP, verifyOTP } = pkg;
import joiPkg from "joi";
const { ValidationError } = joiPkg;

import db from "../db/database.js";
// import upload from "../uploads/multer.js";
import uploads from "../uploads/cloudinary.js";
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
    
    const response = await sendOTP(
      req.body.country_code + req.body.phone_no.toString(),
      "",
      "SMS",
      "",
      "",
      1200,
      4,
      process.env.OTPLESS_API_KEY,
      process.env.OTPLESS_API_SECRET
    );
    // const response = await sendOTP(phoneNumber, email, channel, hash, orderId, expiry, otpLength, clientId, clientSecret)

    console.log(response);

    res.status(200).json({
      orderId: response.orderId,
      message: "OTP send successfully",
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({
        message: err.message,
      });
    }

    res.status(500).json({
      err: err,
      message: "Failed to send OTP",
    });
  }
};

// --------- resend OTP API ----------

export const resend_OTP = async (req, res, next) => {
  try {
    await resendOTPValidation.validateAsync(req.body);

    const response = await resendOTP(
      req.body.orderId,
      process.env.OTPLESS_API_KEY,
      process.env.OTPLESS_API_SECRET
    );
    // const response = await sendOTP(orderId, clientId, clientSecret)

    console.log(response);

    res.status(200).json({
      orderId: response.orderId,
      message: "OTP resend successfully",
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({
        message: err.message,
      });
    }

    res.status(500).json({
      err: err,
      message: "Failed to resend OTP",
    });
  }
};

// --------- verify OTP ----------

export const verify_OTP = async (req, res, next) => {
  try {
    // await verifyOTPValidation.validateAsync(req.body);

    const { otp, orderId, country_code, phone_no } = req.body;
    // const { name, email, password, country_code, phone_no, role } = req.body.userData;

    const response = await verifyOTP(
      "",
      country_code + phone_no.toString(),
      orderId,
      otp,
      process.env.OTPLESS_API_KEY,
      process.env.OTPLESS_API_SECRET
    );
    console.log("response:", response);

    if (response.isOTPVerified) {
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
  } catch (err) {
    // if (err instanceof ValidationError) {
    //   return res.status(400).json({
    //     message: err.message,
    //   });
    // }

    res.status(500).json({
      success: false,
      message: "Failed to verify OTP, Please Try again",
    });
  }
};

// ------ Image upload for registration ------

const uploadImage = async (img1, img2) => {
  const urls = [];

  const business_license_image_newPath = await uploads(img1);
  const driver_license_image_newPath = await uploads(img2);

  urls.push(business_license_image_newPath.secure_url);
  urls.push(driver_license_image_newPath.secure_url);

  return urls;
};

// --------- register API ----------

export const register = async (req, res, next) => {
  const { name, email, password, country_code, phone_no, role } = req.body;

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
    console.log(user);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    if (role == 2) {
      const [userInsertResult] = await db.execute(
        "INSERT INTO users(name, email, password, country_code, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, hash, country_code, phone_no, role]
      );
      userId = userInsertResult.insertId;
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
      const business_license_image = req.files.businessLicenseImage[0].path;
      const driver_license_image = req.files.driverLicenseImage[0].path;

      console.log(business_license_image);

      const [userInsertResult] = await db.execute(
        "INSERT INTO users(name, email, password, country_code, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, hash, country_code, phone_no, role]
      );
      userId = userInsertResult.insertId;

      const imageResult = await uploadImage(
        business_license_image,
        driver_license_image
      );
      const [bl_img_url = "", dl_img_url = ""] = imageResult ?? [];

      console.log(bl_img_url);
      const sql =
        "INSERT INTO userDetails(user_id, business_license_number, business_license_image, bio, order_type, distance_and_fee, food_category, driver_name, driver_license_number, driver_license_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      const values = [
        userId,
        businessLicenseNum,
        bl_img_url,
        bio,
        orderType,
        distanceAndFeel,
        foodCategory,
        driverName,
        driverLicenseNumber,
        dl_img_url,
      ];

      await db.execute(sql, values);

      await db.execute(
        "INSERT INTO addresses(user_id, address) VALUES (?, ?)",
        [userId, address]
      );
    }

    res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    // if (err instanceof ValidationError) {
    //   return res.status(400).json({
    //     message: err.message,
    //   });
    // }

    console.log(err);
    res.status(500).json({
      success: false,
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
    // console.log(user.length);
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
    // console.log(user);

    const { id, email, password, role, ...rest } = user[0];

    // console.log(email,password, role, id,);

    const token = jwt.sign(
      { id: id, email: email, role: role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        expires: token.expiresIn,
      })
      .status(200)
      .json({
        token,
        email,
        data: { ...rest },
        role,
      });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
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
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to change password.",
    });
  }
};

// ----------- forgot password API -------------

export const forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  // const role = req.body.role;

  try {
    await userForgetPasswordValidation.validateAsync(req.body);

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

    const link = `http://127.0.0.1:4000/api/v1/auth/reset-password/${row[0].id}/${token}`;

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

    // console.log(link);
    res.status(200).json({
      success: true,
      message: "Please check your email for password reset.",
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to reset password.",
    });
  }
};

// ---------- reset password API ------------

export const resetPassword = async (req, res, next) => {
  const password = req.body.password;
  const userId = req.params.id;
  const token = req.params.token;

  try {
    await userResetPasswordValidation.validateAsync(req.body);

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
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid Token",
        });
      }

      try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const sql = "UPDATE users SET password = ? WHERE id = ?";
        const values = [hash, userId];

        await db.execute(sql, values);

        res.status(200).json({
          success: true,
          message: "Your new password has been created successfully.",
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to reset password. Please try again.",
        });
      }
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to reset password. Please try again.",
    });
  }
};
