const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const uploadProduct = require("../middleware/uploadProduct");
// const auth = require("../middleware/authMiddleware");

/* =====================================================
   ADMIN ROUTES (JWT PROTECTED)
   Used ONLY by React Admin Panel
===================================================== */

// ✅ BULK DELETE — MUST BE FIRST
router.delete(
  "/bulk-delete",
  
  productController.bulkDeleteProducts
);

// CREATE PRODUCT
router.post(
  "/",
  
  uploadProduct.single("image"),
  productController.createProduct
);

// GET ALL PRODUCTS (ADMIN LIST)
router.get(
  "/",
  
  productController.getProducts
);

// GET PRODUCT BY ID (ADMIN EDIT)
router.get(
  "/:id",
  
  productController.getProductById
);

// UPDATE PRODUCT
router.put(
  "/:id",
  
  uploadProduct.single("image"),
  productController.updateProduct
);

// DELETE SINGLE PRODUCT — MUST BE LAST
router.delete(
  "/:id",
  
  productController.deleteProduct
);

/* =====================================================
   PUBLIC ROUTES (NO AUTH — WEBSITE)
===================================================== */

// ✅ ALL PRODUCTS (WEBSITE LISTING)
router.get(
  "/public/list",
  productController.getProducts
);

// ✅ FEATURED PRODUCTS
router.get(
  "/featured/list",
  productController.getFeaturedProducts
);

// ✅ PRODUCTS BY CATEGORY (SLUG BASED)
router.get(
  "/category/:slug",
  productController.getProductsByCategory
);

module.exports = router;
