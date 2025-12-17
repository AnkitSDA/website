console.log("🔥 APP.JS EXECUTED 🔥");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const productImageRoutes = require("./routes/productImageRoutes");




const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-images", productImageRoutes);
app.use("/uploads", express.static("uploads"));




app.get("/", (req, res) => {
  res.send("Goodfine Backend Running 🚀");
});

module.exports = app;
