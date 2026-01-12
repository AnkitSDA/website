const db = require("../config/db");

/* =========================
   CREATE CATEGORY
========================= */
exports.createCategory = (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Form data missing" });
  }

  const {
    name,
    meta_title,
    meta_description,
    keywords,
    status,
  } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const image = req.files?.image?.[0]?.filename || null;
  const banner_image = req.files?.banner_image?.[0]?.filename || null;

  const sql = `
    INSERT INTO categories
    (name, slug, meta_title, meta_description, keywords, image, banner_image, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      slug,
      meta_title || null,
      meta_description || null,
      keywords || null,
      image,
      banner_image,
      status || "active",
    ],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Category created successfully" });
    }
  );
};

/* =========================
   GET ALL CATEGORIES
========================= */
exports.getCategories = (req, res) => {
  const sql = "SELECT * FROM categories ORDER BY created_at DESC";

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

/* =========================
   GET CATEGORY BY ID
========================= */
exports.getCategoryById = (req, res) => {
  db.query(
    "SELECT * FROM categories WHERE id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows[0]);
    }
  );
};

/* =========================
   UPDATE CATEGORY
   (WITH REMOVE IMAGE/BANNER)
========================= */
exports.updateCategory = (req, res) => {
  const { id } = req.params;

  const {
    name,
    meta_title,
    meta_description,
    keywords,
    status,
    remove_image,
    remove_banner,
  } = req.body;

  const newImage = req.files?.image?.[0]?.filename || null;
  const newBanner = req.files?.banner_image?.[0]?.filename || null;

  // 1️⃣ Fetch old images
  db.query(
    "SELECT image, banner_image FROM categories WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (!rows.length) {
        return res.status(404).json({ message: "Category not found" });
      }

      let image = rows[0].image;
      let banner_image = rows[0].banner_image;

      // 2️⃣ Apply remove flags
      if (remove_image === "1") image = null;
      if (remove_banner === "1") banner_image = null;

      // 3️⃣ Apply new uploads (override remove)
      if (newImage) image = newImage;
      if (newBanner) banner_image = newBanner;

      // 4️⃣ Update DB
      const sql = `
        UPDATE categories SET
          name = ?,
          meta_title = ?,
          meta_description = ?,
          keywords = ?,
          status = ?,
          image = ?,
          banner_image = ?
        WHERE id = ?
      `;

      db.query(
        sql,
        [
          name,
          meta_title,
          meta_description,
          keywords,
          status,
          image,
          banner_image,
          id,
        ],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Category updated successfully" });
        }
      );
    }
  );
};

/* =========================
   DELETE CATEGORY
========================= */
exports.deleteCategory = (req, res) => {
  db.query(
    "DELETE FROM categories WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Category deleted successfully" });
    }
  );
};
