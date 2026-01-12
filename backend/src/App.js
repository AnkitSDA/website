console.log("🔥 APP.JS EXECUTED 🔥");
const path = require("path"); // ✅ ADD THIS LINE


const express = require("express");
const cors = require("cors");

const app = express();

// ========================
// GLOBAL MIDDLEWARE (FIRST)
// ========================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================
// STATIC FILES (ONLY THIS)
// ========================
console.log("STATIC ENABLED:", path.join(__dirname, "..", "uploads"));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);


// ========================
// ROUTES
// ========================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/product-images", require("./routes/productImageRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/seo-pages", require("./routes/seoPageRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/leads", require("./routes/leadRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/bulk-upload", require("./routes/bulkUploadRoutes"));
app.use("/api/public", require("./routes/publicProductRoutes"));



// ========================
// HEALTH CHECK
// ========================
app.get("/", (req, res) => {
  res.send("Goodfine Backend Running 🚀");
});

module.exports = app;
