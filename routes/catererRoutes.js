import express from "express";

import { verifyToken } from "../utils/verifyToken.js";
import { getAllCaterer, getAllProducts, getAllSubCategory, getSingleCaterer } from "../controller/userController.js";

const router = express.Router();


router.get("/get-caterers", getAllCaterer);

router.get("/get-caterer/:catererId", getSingleCaterer);

router.get("/get-sub-category/:categoryId", getAllSubCategory)

router.get("/get-products/:subCategoryId", getAllProducts)

export default router;