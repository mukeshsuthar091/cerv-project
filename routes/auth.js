import express from "express";

import { changePassword, forgotPassword, login, register, resend_OTP, resetPassword, send_OTP, verify_OTP } from "../controller/authController.js";
import { verifyToken } from "../utils/verifyToken.js";
import upload from "../uploads/multer.js";

const router = express.Router();

router.post("/send-otp", send_OTP);

router.post("/resend-otp", resend_OTP)

router.post("/verify-otp", verify_OTP);

router.post("/register",upload.array("image"), register);

router.post("/login", login);

router.put("/change-password", verifyToken, changePassword);

router.post("/forgot-password", forgotPassword)

router.post("/reset-password/:id/:token", resetPassword)


export default router;