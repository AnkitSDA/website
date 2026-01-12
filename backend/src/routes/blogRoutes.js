const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogBySlug,
  getPublishedBlogs,
   getBlogById  
} = require("../controllers/blogController");

const storage = multer.diskStorage({
  destination: "uploads/blogs",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// CREATE
router.post("/", upload.single("image"), createBlog);

// UPDATE
router.put("/:id", upload.single("image"), updateBlog);

// ✅ VERY IMPORTANT (THIS WAS MISSING)
router.get("/", getPublishedBlogs);

// OPTIONAL (can keep or remove)
router.get("/published", getPublishedBlogs);

// DETAIL
router.get("/:id", getBlogById);        // 👈 ADMIN EDIT
router.get("/detail/:slug", getBlogBySlug);


// DELETE
router.delete("/:id", deleteBlog);

module.exports = router;
