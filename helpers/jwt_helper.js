import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signAccessToken = (user) => {

  return new Promise((resolve, reject) => {
    const payload = { id: user.id, email: user.email, role: user.role };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const option = { expiresIn: "1d" };

    jwt.sign(payload, secret, option, (err, token) => {
      if (err) {
        console.log(err);
        // reject(err);
        reject(new Error("Error creating AccessToken"));
      }

      resolve(token);
    });
  });
};

export const verifyAccessToken = (accessToken) => {

  return new Promise((resolve, reject) => {
    const secret = process.env.ACCESS_TOKEN_SECRET;

    jwt.verify(accessToken, secret, (err, user) => {
      if (err) {
        reject(err);
      }

      resolve(user);
    });
  });
};

export const signRefreshToken = (user) => {

  return new Promise((resolve, reject) => {
    const payload = { id: user.id, email: user.email, role: user.role };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const option = { expiresIn: "1y" };

    jwt.sign(payload, secret, option, (err, token) => {
      if (err) {
        console.log(err);
        reject(new Error("Error creating refreshToken"));
      }

      resolve(token);
    });
  });

};

export const verifyRefreshToken = (refreshToken) => {

  return new Promise((resolve, reject) => {
    const secret = process.env.REFRESH_TOKEN_SECRET;

    jwt.verify(refreshToken, secret, (err, user) => {
      if (err) {
        reject(err);
      }
      resolve(user);
    });
  });
};
