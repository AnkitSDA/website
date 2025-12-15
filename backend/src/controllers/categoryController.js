const db = require("../config/db");
const slugify = require("slugify");

// CREATE CATEGORY
exports.createCategory = (req, res) => {
  const { name, meta_title, status } = req.body;

  if (!name || !meta_title) {
    return res.status(400).json({ message: "Name and meta_title are required" });
  }

  const slug = slugify(name, { lower: true });

  const sql = `
    INSERT INTO categories (name, meta_title, slug, status)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, meta_title, slug, status || "active"],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Category created successfully" });
    }
  );
};

// READ ALL CATEGORIES
exports.getCategories = (req, res) => {
  db.query(
    "SELECT * FROM categories WHERE status='active' ORDER BY id DESC",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// READ SINGLE CATEGORY BY SLUG
exports.getCategoryBySlug = (req, res) => {
  db.query(
    "SELECT * FROM categories WHERE slug = ?",
    [req.params.slug],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results[0]);
    }
  );
};

// UPDATE CATEGORY
exports.updateCategory = (req, res) => {
  const { name, meta_title, status } = req.body;

  if (!name || !meta_title) {
    return res.status(400).json({ message: "Name and meta_title are required" });
  }

  const slug = slugify(name, { lower: true });

  const sql = `
    UPDATE categories
    SET name = ?, meta_title = ?, slug = ?, status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, meta_title, slug, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Category updated successfully" });
    }
  );
};

// DELETE CATEGORY
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
