import express from "express";

import { verifyToken } from "../utils/verifyToken.js";
import {
  createCategory,
  createProduct,
  createSubCategory,
  deleteCategory,
  deleteProduct,
  deleteSubCategory,
  getAllCategories,
  getAllProducts,
  getAllSubCategories,
  getSingleProduct,
  updateCategory,
  updateProduct,
  updateSubCategory,
} from "../controller/adminController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// ----------- categories ------------
router.get("/categories", verifyToken, getAllCategories);

router.post("/categories", upload.single("image"), verifyToken, createCategory);

router.put("/categories/:categoryId", upload.single("image"), verifyToken, updateCategory);

router.delete("/categories/:categoryId", verifyToken, deleteCategory);


// ----------- sub-categories ------------
router.get("/categories/:categoryId/sub-categories", verifyToken, getAllSubCategories);

router.post("/categories/:categoryId/sub-categories", upload.single("image"), verifyToken, createSubCategory);

router.put("/sub-categories/:subCategoryId", upload.single("image"), verifyToken, updateSubCategory);

router.delete("/sub-categories/:subCategoryId", verifyToken, deleteSubCategory);


// ----------- products ------------
router.get("/categories/:categoryId/sub-categories/:subCategoryId/products", verifyToken, getAllProducts);

router.get("/categories/:categoryId/sub-categories/:subCategoryId/products/:productId", verifyToken, getSingleProduct);

router.post("/categories/:categoryId/sub-categories/:subCategoryId/products", upload.single("image"), verifyToken, createProduct);

router.put("/categories/:categoryId/sub-categories/:subCategoryId/products/:productId", upload.single("image"), verifyToken, updateProduct);

router.delete("/categories/:categoryId/sub-categories/:subCategoryId/products/:productId", verifyToken, deleteProduct);


export default router;
