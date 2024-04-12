import express from "express";

import { verifyToken } from "../utils/verifyToken.js";
import { getAllCaterer } from "../controller/catererController.js";

const router = express.Router();


router.get("/get-caterers", getAllCaterer);


export default router;