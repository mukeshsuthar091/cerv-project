import mysql from "mysql2";

const conn = mysql.createPool({
  user: "sql8696328",
  host: "sql8.freesqldatabase.com",
  password: 'URAPNLFqWm',
  database: "sql8696328",
});


export default conn.promise();
