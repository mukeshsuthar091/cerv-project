import db from "../db/database.js";

export const getAllCaterer = async (req, res, next) => {
  
  try {
    const [data, field] = await db.execute(`SELECT * FROM WHERE role = 1`);
    console.log("", data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to retrieve caterer's data;",
    });
  }
};
