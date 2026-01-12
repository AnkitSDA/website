const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/uploadProductImages");

const {
  uploadProductImages,
  getProductImages,
  deleteProductImage,
} = require("../controllers/productImageController");

// Upload gallery images
router.post(
  "/:productId/images",
  verifyToken,
  upload.array("images", 5),
  uploadProductImages
);

// Get gallery images
router.get(
  "/:productId/images",
  getProductImages
);

// Delete single image
router.delete(
  "/images/:id",
  verifyToken,
  deleteProductImage
);

module.exports = router;
