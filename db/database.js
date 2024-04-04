import mysql from "mysql2";
import dotenv from 'dotenv';

dotenv.config();
const conn = mysql.createPool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

export default conn.promise();
