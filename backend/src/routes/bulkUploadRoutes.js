const express = require("express");
const router = express.Router();

const uploadCsv = require("../middleware/uploadCsv");
const authMiddleware = require("../middleware/authMiddleware");
const bulkUploadController = require("../controllers/bulkUploadController");

router.post(
  "/categories",
  authMiddleware,
  uploadCsv.single("file"),
  bulkUploadController.bulkUploadCategories
);

router.post(
  "/products",
  authMiddleware,
  uploadCsv.single("file"),
  bulkUploadController.bulkUploadProducts
);

module.exports = router;
