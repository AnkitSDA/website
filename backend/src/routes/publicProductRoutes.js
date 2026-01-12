const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ============================
   PUBLIC: GET ALL PRODUCTS
============================ */
router.get("/products", (req, res) => {
  const sql = `
    SELECT
      p.id,
      p.name,
      p.slug,
      p.short_description,
      COALESCE(p.image, pi.image) AS display_image
    FROM products p
    LEFT JOIN product_images pi
      ON pi.product_id = p.id
    WHERE p.status = 'active'
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("PUBLIC PRODUCTS SQL ERROR:", err);
      return res.status(500).json({
        message: "Server error",
        error: err.sqlMessage || err.message
      });
    }
    res.json(rows);
  });
});

/* ============================
   PUBLIC: PRODUCT BY SLUG
============================ */
router.get("/products/:slug", (req, res) => {
  const sql = `
    SELECT *
    FROM products
    WHERE slug = ?
      AND status = 'active'
    LIMIT 1
  `;

  db.query(sql, [req.params.slug], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(rows[0]);
  });
});

/* ============================
   PUBLIC: PRODUCT IMAGES
============================ */
router.get("/products/:id/images", (req, res) => {
  const sql = `
    SELECT id, image, is_primary
    FROM product_images
    WHERE product_id = ?
    ORDER BY is_primary DESC, id ASC
  `;

  db.query(sql, [req.params.id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(rows);
  });
});

module.exports = router;
