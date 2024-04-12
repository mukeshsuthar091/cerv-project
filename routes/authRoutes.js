import express from "express";

import {
  changePassword,
  forgotPassword,
  login,
  register,
  resend_OTP,
  resetPassword,
  resetPasswordLinkVerify,
  send_OTP,
  verify_OTP,
} from "../controller/authController.js";
import { verifyToken } from "../utils/verifyToken.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/send-otp", send_OTP);

router.post("/resend-otp", resend_OTP);

router.post("/verify-otp", verify_OTP);

router.post(
  "/register",
  upload.fields([
    { name: "image", maxCount: 1},
    { name: "businessLicenseImage", maxCount: 1 },
    { name: "driverLicenseImage", maxCount: 1 },
  ]),
  register
);

router.post("/login", login);

router.put("/change-password", verifyToken, changePassword);

router.post("/forgot-password", forgotPassword);

router.get("/reset-password/:id/:token", resetPasswordLinkVerify);

router.post("/reset-password/", resetPassword);

export default router;
