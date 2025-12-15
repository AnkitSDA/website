const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

router.post("/", auth, createCategory);   // 👈 THIS IS REQUIRED
router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);
router.put("/:id", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);

module.exports = router;
