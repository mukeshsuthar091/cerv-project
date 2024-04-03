import express from "express";

import { generateOTP, login, register, verifyOTP } from "../controller/authController.js";

const router = express.Router();

router.get("/otp", generateOTP);

router.post("/otp", verifyOTP);

router.post("/register", register);

router.post("/login", login);


export default router;