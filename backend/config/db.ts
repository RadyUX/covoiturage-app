
import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "sql7.freesqldatabase.com",
  user: "sql7790472",
  password: "uF4c1z3p38",
  database: "sql7790472",
});
