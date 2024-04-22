import { verifyAccessToken } from "../helpers/jwt_helper.js";

export const verifyToken = async (req, res, next) => {
  console.log("headers: ", req.headers);

  try {
    const token = req.headers["x-access-token"];
    console.log("token: ", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
    }

    const user = await verifyAccessToken(token);
    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
      error: err.message,
    });
  }
};
