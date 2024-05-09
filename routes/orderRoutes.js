import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { postReview, cancelOrder, getOrders } from "../controller/orderController.js";

const router = express.Router();

router.get("/get-order", verifyToken, getOrders);

router.post("/cancel-order", verifyToken, cancelOrder);

router.post("/review", verifyToken, postReview);

router.post("/accept-order", verifyToken, )

export default router;
