import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "You are not authorized",
    });
  }
};
