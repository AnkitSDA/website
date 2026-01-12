const db = require("../config/db");

/* ===========================
   CREATE / UPDATE SEO PAGE (ADMIN)
=========================== */
exports.upsertSeoPage = (req, res) => {
  const { page, meta_title, meta_description } = req.body;

  if (!page) {
    return res.status(400).json({ message: "Page is required" });
  }

  const sql = `
    INSERT INTO seo_pages (page, meta_title, meta_description)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      meta_title = VALUES(meta_title),
      meta_description = VALUES(meta_description)
  `;

  db.query(sql, [page, meta_title, meta_description], (err) => {
    if (err) return res.status(500).json(err);

    res.status(200).json({
      message: "SEO page saved successfully"
    });
  });
};

/* ===========================
   GET SEO PAGE (PUBLIC)
=========================== */
exports.getSeoPageByPage = (req, res) => {
  const { page } = req.params;

  const sql = `
    SELECT meta_title, meta_description
    FROM seo_pages
    WHERE page = ?
  `;

  db.query(sql, [page], (err, rows) => {
    if (err) return res.status(500).json(err);

    if (rows.length === 0) {
      return res.status(404).json({ message: "SEO page not found" });
    }

    res.status(200).json(rows[0]);
  });
};

/* ===========================
   DELETE SEO PAGE (ADMIN)
=========================== */
exports.deleteSeoPage = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM seo_pages WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "SEO page not found" });
    }

    res.status(200).json({ message: "SEO page deleted successfully" });
  });
};
