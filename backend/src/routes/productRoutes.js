const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const productController = require("../controllers/productController");


const {
  createProduct,
  getProducts,
  getProductBySlug,
  getProductsByCategory,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

// Admin
router.post("/", auth, createProduct);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);
router.put("/:id", auth, productController.updateProduct);
router.get("/slug/:slug", productController.getProductBySlug);
router.get("/featured", productController.getFeaturedProducts);

// Public
router.get("/", getProducts);
router.get("/category/:slug", getProductsByCategory);
router.get("/:slug", getProductBySlug);
router.get("/:id/details", productController.getProductWithImages);


module.exports = router;
