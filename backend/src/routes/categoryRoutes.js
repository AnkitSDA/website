const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadCategory");
const auth = require("../middleware/authMiddleware");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// ✅ PUBLIC
router.get("/", getCategories);

// 🔒 ADMIN (UPLOAD FIRST → THEN CONTROLLER)
router.post(
  "/",
  auth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "banner_image", maxCount: 1 },
  ]),
  createCategory
);

router.put(
  "/:id",
  auth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "banner_image", maxCount: 1 },
  ]),
  updateCategory
);

router.delete("/:id", auth, deleteCategory);

module.exports = router;
