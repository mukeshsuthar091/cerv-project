import bcrypt from "bcryptjs";
// import mysql from "mysql2";
import db from "./../db/conn.js";

export const generateOTP = async (req, res, next) => {
  const otp = 1234;

  try {
    res.status(200).json({
      otp: otp,
      message: "OTP send successfully",
    });
  } catch (err) {
    res.status(500).json({
      err: err,
      message: "Failed to send OTP",
    });
  }
};

export const verifyOTP = async (req, res, next) => {
  const otp = req.body.otp;
  const { name, email, password, country_code, phone, role } =
    req.body.userData;
  // console.log(name, email, password, country_code, phone);

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await db.query("SELECT * FROM users WHERE email = ?", email)
      .then((result) => {
        // result = data, metadata
        console.log(result[0]);
        if (result[0].length) {
          res.status(422).json({
            success: false,
            message: "User is already exist.",
          });
        } else {
          if (otp === 1234) {
            db.query(
              `INSERT INTO users(name, email, password, country_code, phone, role) VALUES ('${name}', '${email}', '${hash}', '${country_code}', '${phone}', '${role}')`
            )
              .then((result) => {
                res.status(200).json({
                  success: true,
                  userData: { email: email },
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
        }
      })
      .catch((err) => {
        console.error("Error checking user:", err);
        res.status(500).json({
          success: false,
          message: "Error checking user.",
        });
      });
  } catch (err) {
    console.log(err);
  }
};

export const register = async (req, res, next) => {
  // const userDetails = req.body;
  const email = req.body.email;
  const business_license_num = req.body.businessLicenseNum;
  const business_license_image = req.body.businessLicenseImage;
  const address = req.body.address;
  const bio = req.body.bio;
  const order_type = req.body.orderType;
  const distance_fee_waived = req.body.distanceFeeWaived;
  const distance_and_fee = req.body.distanceAndFeel;
  const food_category = req.body.foodCategory;
  const driver_name = req.body.driverName;
  const driver_license_number = req.body.driverLicenseNumber;
  const driver_license_image = req.body.driverLicenseImage;

  console.log(email);
  try {
    
    await db.execute("SELECT * FROM users WHERE email = ?", [email]).then(
      ([row, field]) => {
        if (row.length) {
          console.log(row[0].id)
          const sql =
            "INSERT INTO userDetails(user_id, business_license_number, business_license_image, address, bio, order_type, distance_fee_waived, distance_and_fee, food_category, driver_name, driver_license_number, driver_license_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

          const values = [
            row[0].id,
            business_license_num,
            business_license_image,
            address,
            bio,
            order_type,
            distance_fee_waived,
            distance_and_fee,
            food_category,
            driver_name,
            driver_license_number,
            driver_license_image,
          ];

          console.log(values)

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
        }
        else{
          res.status(500).json({
            success: false,
            message: "user not exist.",
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req, res, next)=>{
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  
  try {
    const [user, fields] = await db.execute("SELECT * FROM users WHERE email = ?", [email])
    // console.log(user.length);

    if (user.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
  } catch (err) {
    console.log(err);
  }
}