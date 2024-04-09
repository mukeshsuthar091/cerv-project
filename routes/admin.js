import express from "express";

import { verifyToken } from "../utils/verifyToken.js";
import upload from "../uploads/multer.js";
import { getProfileData } from "../controller/adminController.js";

const router = express.Router();

router.get("/get-profile-data", verifyToken, getProfileData);

router.post("/edit-profile-data");

export default router;