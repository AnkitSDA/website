const db = require("../config/db");
const fs = require("fs");
const path = require("path");


/* ===========================
   CREATE APPLICATION (ADMIN)
=========================== */
exports.createApplication = (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const image = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO applications (title, description, image)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [title, description, image], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(201).json({
      message: "Application created successfully",
      applicationId: result.insertId
    });
  });
};

/* ===========================
   GET APPLICATIONS (PUBLIC)
=========================== */
exports.getApplications = (req, res) => {
  const sql = `
    SELECT id, title, description, image, created_at
    FROM applications
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json(results);
  });
};

/* ===========================
   DELETE APPLICATION (ADMIN)
=========================== */
exports.deleteApplication = (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT image FROM applications WHERE id = ?";
  const deleteSql = "DELETE FROM applications WHERE id = ?";

  db.query(selectSql, [id], (err, rows) => {
    if (err) return res.status(500).json(err);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    const image = rows[0].image;

    db.query(deleteSql, [id], (err, result) => {
      if (err) return res.status(500).json(err);

      if (image) {
        const imagePath = path.join(__dirname, "../../uploads", image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      res.status(200).json({ message: "Application deleted successfully" });
    });
  });
};
