import express from "express";

import { verifyToken } from "../utils/verifyToken.js";
import upload from "../uploads/multer.js";
import {
  editProfileData,
  getProfileData,
  setAddress,
} from "../controller/userProfileController.js";

const router = express.Router();

router.get("/get-profile-data", verifyToken, getProfileData);

router.post(
  "/edit-profile-data",
  upload.fields([
    { name: "businessLicenseImage", maxCount: 1 },
    { name: "driverLicenseImage", maxCount: 1 },
  ]),
  verifyToken,
  editProfileData
);

router.get("/get-address", verifyToken);

router.post("/set-address", verifyToken, setAddress);

// router.put("/set-address", verifyToken, setAddress);

export default router;
