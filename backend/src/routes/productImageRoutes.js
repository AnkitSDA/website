const express = require("express");
const router = express.Router(); // ✅ MUST COME FIRST

const auth = require("../middleware/authMiddleware");
const upload = require("../config/multer");
const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// DELETE PRODUCT IMAGE
router.delete("/:imageId", auth, (req, res) => {
  const { imageId } = req.params;

  // 1️⃣ Get image record
  db.query(
    "SELECT image FROM product_images WHERE id = ?",
    [imageId],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.status(404).json({ message: "Image not found" });
      }

      const imageName = results[0].image;
      const imagePath = path.join("uploads", imageName);

      // 2️⃣ Delete DB record
      db.query(
        "DELETE FROM product_images WHERE id = ?",
        [imageId],
        (err) => {
          if (err) return res.status(500).json(err);

          // 3️⃣ Delete image file
          fs.unlink(imagePath, (err) => {
            if (err && err.code !== "ENOENT") {
              return res
                .status(500)
                .json({ message: "File delete failed" });
            }

            res.json({ message: "Image deleted successfully" });
          });
        }
      );
    }
  );
});

// 🔹 TEST ROUTE
router.get("/ping", (req, res) => {
  res.json({ message: "Product Image Routes OK ✅" });
});

// 🔹 UPLOAD PRODUCT IMAGE
router.post(
  "/:productId",
  auth,
  upload.single("image"),
  (req, res) => {
    const { productId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const image = req.file.filename;

    // check product exists
    db.query(
      "SELECT id FROM products WHERE id = ?",
      [productId],
      (err, results) => {
        if (err) return res.status(500).json({ message: "DB error" });

        if (results.length === 0) {
          return res.status(404).json({ message: "Product not found" });
        }

        const sql = `
          INSERT INTO product_images (product_id, image)
          VALUES (?, ?)
        `;

        db.query(sql, [productId, image], (err) => {
          if (err) return res.status(500).json({ message: "Insert failed" });

          res.status(201).json({
            message: "Image uploaded successfully",
            image,
          });
        });
      }
    );
  }
);
router.get("/:productId", (req, res) => {
  const { productId } = req.params;

  db.query(
    "SELECT id, image FROM product_images WHERE product_id = ?",
    [productId],
    (err, results) => {
      if (err) return res.status(500).json(err);

      const images = results.map(img => ({
        id: img.id,
        url: `${req.protocol}://${req.get("host")}/uploads/${img.image}`
      }));

      res.json(images);
    }
  );
});
module.exports = router;
