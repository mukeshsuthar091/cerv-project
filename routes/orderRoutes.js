import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { postReview, cancelOrder, getOrders, acceptOrder, rejectOrder } from "../controller/orderController.js";

const router = express.Router();

router.get("/get-order", verifyToken, getOrders);

router.post("/cancel-order", verifyToken, cancelOrder);

router.post("/review", verifyToken, postReview);

router.post("/accept-order", verifyToken, acceptOrder)

router.post("/reject-order", verifyToken, rejectOrder)

export default router;
