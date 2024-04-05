import fs from "fs";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
// const { sendOTP, verifyOTP } = require('otpless-node-js-auth-sdk');
import pkg from "otpless-node-js-auth-sdk";
const { sendOTP, resendOTP, verifyOTP } = pkg;

import db from "../db/database.js";
// import upload from "../uploads/multer.js";
import uploads from "../uploads/cloudinary.js";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "king.kunze@ethereal.email",
    pass: "yzzSSH1Nj7fqsHkMhC",
  },
});

// ------------------------- All APIs -------------------------------

export const send_OTP = async (req, res, next) => {
  try {
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
      otp: response.orderId,
      message: "OTP send successfully",
    });
  } catch (err) {
    res.status(500).json({
      err: err,
      message: "Failed to send OTP",
    });
  }
};

export const resend_OTP = async (req, res, next) => {
  try {
    const response = await resendOTP(
      req.body.orderId,
      process.env.OTPLESS_API_KEY,
      process.env.OTPLESS_API_SECRET
    );
    // const response = await sendOTP(orderId, clientId, clientSecret)

    console.log(response);

    res.status(200).json({
      otp: response.orderId,
      message: "OTP resend successfully",
    });
  } catch (err) {
    res.status(500).json({
      err: err,
      message: "Failed to resend OTP",
    });
  }
};

export const verify_OTP = async (req, res, next) => {
  const otp = req.body.otp;
  const orderId = req.body.orderId;
  const { name, email, password, country_code, phone_no, role } =
    req.body.userData;
  // console.log(name, email, password, country_code, phone);

  const response = await verifyOTP(
    email,
    country_code + phone_no.toString(),
    orderId,
    otp,
    process.env.OTPLESS_API_KEY,
    process.env.OTPLESS_API_SECRET
  );
  console.log("response:", response);

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    if (response.isOTPVerified) {
      await db
        .query("SELECT * FROM users WHERE email = ? AND role = ? ", [
          email,
          role,
        ])
        .then(([user, fields]) => {
          // result = data, metadata
          console.log(user);

          if (user.length) {
            return res.status(409).json({
              success: false,
              message: "A user with the specified email already exists.",
            });
          }

          // `INSERT INTO users(name, email, password, country_code, phone, role) VALUES ('${name}', '${email}', '${hash}', '${country_code}', '${phone}', '${role}')`
          const sql =
            "INSERT INTO users(name, email, password, country_code, phone, role) VALUES (?, ?, ?, ?, ?, ?)";
          const values = [name, email, hash, country_code, phone_no, role];

          return db.execute(sql, values);
        })
        .then((result) => {
          res.status(200).json({
            success: true,
            userData: { email: email, role: role },
            message: "OTP Verified successfully",
          });
        })
        .catch((err) => {
          console.error("Error inserting user:", err);
          res.status(500).json({
            success: false,
            message: "Error inserting user.",
          });
        });
    } else {
      // If OTP verification fails, return an error response
      res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to created. Try again",
    });
  }
};

export const register = async (req, res, next) => {
  const email = req.body.email;
  const role = Number(req.body.role);
  const business_license_num = req.body.businessLicenseNum;
  // const business_license_image = req.body.businessLicenseImage;
  const address = req.body.address;
  const bio = req.body.bio;
  const order_type = req.body.orderType;
  const distance_fee_waived = req.body.distanceFeeWaived;
  const distance_and_fee = req.body.distanceAndFeel;
  const food_category = req.body.foodCategory;
  const driver_name = req.body.driverName;
  const driver_license_number = req.body.driverLicenseNumber;
  // const driver_license_image = req.body.driverLicenseImage;

  console.log(req.files);
  // console.log(email);

  if (req.method === "POST") {
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      console.log(path);
      const newPath = await uploads(path);

      urls.push({
        secure_url: newPath.secure_url,
        public_id: newPath.public_id,
      });
    }
  }
  // console.log(role, email)

  let userId;

  try {
    await db
      .execute("SELECT * FROM users WHERE email = ? AND role = ? ", [
        email,
        role,
      ])
      .then(([user, field]) => {
        console.log(user);
        userId = user[0].id;
        return db.execute("SELECT * FROM userDetails WHERE user_id = ? ", [
          userId,
        ]);
      })
      .then(([userDetails, fields]) => {
        if (!userDetails.length) {
          const sql =
            "INSERT INTO userDetails(user_id, business_license_number, business_license_image, address, bio, order_type, distance_fee_waived, distance_and_fee, food_category, driver_name, driver_license_number, driver_license_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

          const values = [
            userId,
            business_license_num,
            null,
            address,
            bio,
            order_type,
            distance_fee_waived,
            distance_and_fee,
            food_category,
            driver_name,
            driver_license_number,
            null,
          ];

          console.log(values);

          db.execute(sql, values)
            .then((result) => {
              res.status(200).json({
                success: true,
                message: "user registered successfully",
              });
            })
            .catch((err) => {
              console.error("Error inserting user:", err);
              res.status(500).json({
                success: false,
                message: "registration failed",
              });
            });
        } else {
          res.status(500).json({
            success: false,
            message: "user is already register.",
          });
        }
      });
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req, res, next) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userRole = req.body.role;

  try {
    const [user, fields] = await db.execute(
      "SELECT * FROM users WHERE email = ? AND role = ? ",
      [userEmail, userRole]
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

    const { password, role, ...rest } = user[0];

    console.log(password, role, user[0].id, rest);

    const token = jwt.sign(
      { id: user[0].id, role: user[0].role },
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
        data: { ...rest },
        role,
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

export const changePassword = async (req, res, next) => {
  const user = req.user;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  console.log(user);
  try {
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

    bcrypt.compare(oldPassword, row[0].password).then((isEqual) => {
      if (!isEqual) {
        return res.status(401).json({
          success: false,
          message: "Wrong Password",
        });
      }
    });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    const sql = "UPDATE users SET password= ? WHERE id= ? AND role = ?";
    const values = [hash, user.id, user.role];

    db.execute(sql, values)
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "Password change successfully.",
        });
      })
      .catch((err) => {
        // console.error("Error inserting user:", err);
        res.status(500).json({
          success: false,
          message: "Failed, Try Again.",
        });
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to change password.",
    });
  }
};

export const forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  const role = req.body.role;

  try {
    const [row, fields] = await db.execute(
      "SELECT * FROM users WHERE email = ? AND role = ? ",
      [email, role]
    );

    if (!row.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // console.log(req.body);
    const token = jwt.sign(
      { id: row[0].id, email: email, role: row[0].role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    const link = `http://127.0.0.1:3000/api/v1/auth/reset-password/${row[0].id}/${token}`;

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
    res.status(500).json({
      success: false,
      message: "Failed to reset password.",
    });
  }
};

export const resetPassword = async (req, res, next) => {
  const password = req.body.password;
  const userId = req.params.id;
  const token = req.params.token;

  // console.log(password, userId, token);

  const [row, fields] = await db.execute("SELECT * FROM users WHERE id = ? ", [
    userId,
  ]);

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

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid Token",
        });
      }
    });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const sql = "UPDATE users SET password= ? WHERE id= ?";
    const values = [hash, userId];

    db.execute(sql, values)
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "Your new password created successfully.",
        });
      })
      .catch((err) => {
        // console.error("Error inserting user:", err);
        res.status(500).json({
          success: false,
          message: "Failed, Try Again.",
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reset password.",
    });
  }
};
