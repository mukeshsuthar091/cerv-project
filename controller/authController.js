import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


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

    await db.query("SELECT * FROM users WHERE email = ? AND role = ? ", [email, role])
      .then(([user, fields]) => {
        // result = data, metadata
        console.log(user);

        if (user.length ) {
          return res.status(409).json({
            success: false,
            message: "A user with the specified email already exists.",
          });
        }

        if (otp === 1234) {
          db.query(
            `INSERT INTO users(name, email, password, country_code, phone, role) VALUES ('${name}', '${email}', '${hash}', '${country_code}', '${phone}', '${role}')`
          )
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
      })
      // .catch((err) => {
      //   console.error("Error checking user:", err);
      //   res.status(500).json({
      //     success: false,
      //     message: "Error checking user.",
      //   });
      // });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to created. Try again",
    });
  }
};

export const register = async (req, res, next) => {
  // const userDetails = req.body;
  const email = req.body.email;
  const role = req.body.role;
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
  let userId;

  try {
    await db
      .execute("SELECT * FROM users WHERE email = ? AND role = ? ", [email, role])
      .then(([user, field]) => {
        userId = user[0].id;
        return db.execute("SELECT * FROM userDetails WHERE user_id = ? ", [userId]);
      })
      .then(([userDetails, fields])=>{

        if (!userDetails.length) {
          const sql =
            "INSERT INTO userDetails(user_id, business_license_number, business_license_image, address, bio, order_type, distance_fee_waived, distance_and_fee, food_category, driver_name, driver_license_number, driver_license_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

          const values = [
            user[0].id,
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
    const [user, fields] = await db.execute("SELECT * FROM users WHERE email = ? AND role = ? ", [userEmail, userRole]);
    // console.log(user.length);
    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    
    // if user is exist then check the password or compare the password
    const checkCorrectPassword = await bcrypt.compare(userPassword, user[0].password);

    if(!checkCorrectPassword){
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      })
    }

    const {password, role, ...rest} = user[0];

    // console.log(email, password, role, id);

    const token = jwt.sign(
      {id: user[0].id, role: user[0].role},
      'gahg48589a45ajfjAUFAHHFIhufuu',
      { expiresIn: '15d'});

    res.cookie("accessToken", token, {
      httpOnly: true,
      expires: token.expiresIn,
    })
    .status(200)
    .json({
      token, data: {...rest}, role
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};
