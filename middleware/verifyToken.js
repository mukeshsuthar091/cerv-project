import { verifyAccessToken } from "../helpers/jwt_helper.js";

export const verifyToken = async (req, res, next) => {
  // Retrieve the Authorization header
  // const authHeader = req.headers.authorization;
  // // const authHeader = req.get("Authorization");
  // console.log(authHeader);
  console.log("headers: ", req.headers);

  // // Check if the Authorization header is present and starts with 'Bearer '
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return res.status(401).json({
  //     success: false,
  //     message: "You are not authorized",
  //   });
  // }

  // // Extract the token from the Authorization header
  // const token = authHeader.split(" ")[1];

  // // Verify the token
  // jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
  //   if (err) {
  //     return res.status(401).json({
  //       success: false,
  //       message: "Invalid Token",
  //     });
  //   }

  //   // Attach the user information to the request object
  //   req.user = user;

  //   // Proceed to the next middleware
  //   next();
  // });

  //--------------------------------------

  try {
    // Retrieve the Authorization header
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

    // Proceed to the next middleware
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
      error: err.message,
    });
  }
};
