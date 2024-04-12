import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mysql from "mysql2";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from 'cloudinary';
import multer from "multer";


import db from "./db/database.js";
import authRoute from "./routes/authRoutes.js";
import userProfileRoute from "./routes/userProfileRoutes.js";
import catererRoute from "./routes/catererRoutes.js";
// import productRoute from "./routes/productRoutes.js";
// import categoryRoutes from "./routes/categoryRoutes.js";
// import subCategoryRoutes from "./routes/subCategoryRoutes.js";


dotenv.config();
// console.log(process.env);
const app = express();
const port = process.env.PORT || 8000;


// ----------- middleware -------------

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/profile", userProfileRoute);
app.use("/api/v1/caterers", catererRoute);
// app.use("/api/v1/products", productRoute);



// ----------- server connection -------------
app.listen(port, () => {
  console.log("Sever listening on port ", port);

  db.query("select 1")
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Error connecting to database:", err));
});
