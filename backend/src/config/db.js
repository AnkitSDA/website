console.log("🔥 DB.JS EXECUTED 🔥");
const mysql = require("mysql2");

console.log("🔥 DB.JS EXECUTED 🔥");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = db;
