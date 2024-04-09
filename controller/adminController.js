import joiPkg from "joi";
const { ValidationError } = joiPkg;

import db from "../db/database.js";
import uploads from "../uploads/cloudinary.js";

export const getProfileData = async (req, res, next) => {
  const { id, email, role } = req.user;

//   console.log(id, email, role);

  try {
    if (role === 2) {
      let [data, field] = await db.execute(
        "SELECT * FROM users JOIN userDetails ON users.id = userDetails.user_id JOIN addresses ON users.id = addresses.user_id"
      );

      console.log(data);
    }
    //     else {
    //       result = db.execute(
    //         "SELECT * FROM users JOIN userDetails ON users.id = userDetails.user_id JOIN addresses ON users.id = addresses.user_id"
    //       );
    //     }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed, try again.",
    });
  }
};
