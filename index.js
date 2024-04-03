import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mysql from "mysql2";

import db from "./db/conn.js";
import authRoute from "./routes/auth.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());

app.use("/api/v1/auth", authRoute);

app.listen(port, () => {
  console.log("Sever listening on port ", port);

  db.query("select 1")
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Error connecting to database:", err));
});
