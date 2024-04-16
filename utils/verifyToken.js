import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.accessToken;

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "You are not authorized",
//     });
//   }

//   jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)=>{
//     if(err){
//       return res.status(401).json({
//         success: false,
//         message: "Invalid Token"
//       })
//     }

//     req.user = user;
//     next();
//   })
// };

export const verifyToken = (req, res, next) => {
  // Retrieve the Authorization header
  const authHeader = req.headers.authorization;
  // Check if the Authorization header is present and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "You are not authorized",
    });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    // Attach the user information to the request object
    req.user = user;

    // Proceed to the next middleware
    next();
  });
};
