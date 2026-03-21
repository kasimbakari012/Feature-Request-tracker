const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "feature_tracker",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// test xampp connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Connected");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
  }
})();

module.exports = pool;