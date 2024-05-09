import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { checkout, getAllCaterer, getAllProducts, getAllSubCategory, getSingleCaterer } from "../controller/userController.js";

const router = express.Router();


router.get("/caterers", getAllCaterer);

router.get("/caterers/:catererId", getSingleCaterer);

router.get("/categories/:categoryId/sub-categories", getAllSubCategory)

router.get("/sub-categories/:subCategoryId/products", getAllProducts)

router.post("/checkout", verifyToken, checkout);

export default router;