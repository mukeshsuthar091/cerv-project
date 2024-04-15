import express from "express";

import { verifyToken } from "../utils/verifyToken.js";
import upload from "../middleware/multer.js";
import {
  getProfileData,
  editProfileData,
  getAllAddress,
  setAddress,
  deleteAddress,
  editAddress,
} from "../controller/userProfileController.js";

const router = express.Router();

router.get("/get-profile-data", verifyToken, getProfileData);

router.post(
  "/edit-profile-data",
  upload.fields([
    { name: "image", maxCount: 1},
    { name: "businessLicenseImage", maxCount: 1 },
    { name: "driverLicenseImage", maxCount: 1 },
  ]),
  verifyToken,
  editProfileData
);

router.get("/addresses", verifyToken, getAllAddress);

router.post("/addresses", verifyToken, setAddress);

router.put("/addresses/:addressId", verifyToken, editAddress);

router.delete("/addresses/:addressId", verifyToken, deleteAddress);

export default router;
