const db = require("../config/db");
const fs = require("fs");
const path = require("path");

/* ==============================
   UPLOAD MULTIPLE PRODUCT IMAGES
================================ */
exports.uploadProductImages = (req, res) => {
  const productId = req.params.productId;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      message: "No images uploaded",
    });
  }

  const values = req.files.map((file, index) => [
    productId,
    file.filename,
    index === 0 ? 1 : 0, // first image is primary
  ]);

  const sql = `
    INSERT INTO product_images (product_id, image, is_primary)
    VALUES ?
  `;

  db.query(sql, [values], (err) => {
    if (err) {
      // cleanup files if DB fails
      req.files.forEach((file) => {
        fs.unlinkSync(
          path.join("uploads/products", file.filename)

        );
      });
      return res.status(500).json(err);
    }

    res.json({
      message: "Product images uploaded successfully",
      count: req.files.length,
    });
  });
};

/* ==============================
   GET PRODUCT IMAGES
================================ */
exports.getProductImages = (req, res) => {
  const productId = req.params.productId;

  const sql = `
    SELECT *
    FROM product_images
    WHERE product_id = ?
    ORDER BY is_primary DESC, id ASC
  `;

  db.query(sql, [productId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

/* ==============================
   DELETE SINGLE IMAGE
================================ */
exports.deleteProductImage = (req, res) => {
  const imageId = req.params.id;

  const getSql =
    "SELECT image FROM product_images WHERE id = ?";

  db.query(getSql, [imageId], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    const imageName = rows[0].image;
    const imagePath = path.join(
      "uploads/products/gallery",
      imageName
    );

    const deleteSql =
      "DELETE FROM product_images WHERE id = ?";

    db.query(deleteSql, [imageId], (err) => {
      if (err) return res.status(500).json(err);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      res.json({
        message: "Image deleted successfully",
      });
    });
  });
};
