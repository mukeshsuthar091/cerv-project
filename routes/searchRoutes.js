import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { getTopCategories } from "../controller/searchController.js";

const router = express.Router();


router.get("/", getTopCategories);


export default router;