import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { createOrder } from "../controller/orderController.js";

const router = express.Router();


router.post("/", verifyToken, createOrder);


export default router;