console.log("🔥 SERVER.JS EXECUTED 🔥");

require("dotenv").config();

const app = require("./src/app");
const db = require("./src/config/db");

const PORT = process.env.PORT || 5000;

db.query("SELECT 1", (err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
    process.exit(1);
  } else {
    console.log("MySQL Connected ✅");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
