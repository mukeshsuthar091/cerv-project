import express from "express";

import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();


router.get("/");


export default router;