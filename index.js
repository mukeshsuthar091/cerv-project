import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mysql from "mysql2";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from 'cloudinary';
import multer from "multer";
import cors from "cors";


import db from "./db/database.js";
import authRoute from "./routes/authRoutes.js";
import profileRoute from "./routes/profileRoutes.js";
import userRoute from "./routes/userRoutes.js";
import adminRoute from "./routes/adminRoutes.js";
import searchRoute from "./routes/searchRoutes.js";
import orderRoute from "./routes/orderRoutes.js";


dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
};



app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/search", searchRoute);



app.listen(port, () => {
  console.log("Sever listening on port ", port);

  db.query("select 1")
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Error connecting to database:", err));
});
