const db = require("../config/db");

/* ============================
   CREATE COMMENT (PUBLIC)
============================ */
exports.createComment = (req, res) => {
  const { blog_id, name, email, comment } = req.body;

  if (!blog_id || !name || !comment) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const sql = `
    INSERT INTO blog_comments (blog_id, name, email, comment)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [blog_id, name, email || null, comment], (err) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({
      message: "Comment submitted successfully (pending approval)",
    });
  });
};

/* ============================
   GET COMMENTS (ADMIN)
============================ */
exports.getComments = (req, res) => {
  const sql = `
    SELECT
      c.id,
      c.name,
      c.email,
      c.comment,
      c.is_approved,
      c.created_at,
      b.title AS blog_title
    FROM blog_comments c
    JOIN blogs b ON c.blog_id = b.id
    ORDER BY c.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

/* ============================
   APPROVE COMMENT
============================ */
exports.approveComment = (req, res) => {
  const sql = `
    UPDATE blog_comments
    SET is_approved = 1
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({ message: "Comment approved successfully" });
  });
};

/* ============================
   DELETE COMMENT
============================ */
exports.deleteComment = (req, res) => {
  const sql = `DELETE FROM blog_comments WHERE id = ?`;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({ message: "Comment deleted successfully" });
  });
};

/* ============================
   GET APPROVED COMMENTS (PUBLIC)
============================ */
exports.getComments = (req, res) => {
  const sql = `
    SELECT 
      c.id,
      b.title AS blog_title,
      c.name,
      c.email,
      c.comment,
      CASE 
        WHEN c.is_approved = 1 THEN 'approved'
        ELSE 'pending'
      END AS status
    FROM blog_comments c
    JOIN blogs b ON b.id = c.blog_id
    ORDER BY c.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};


// UPDATESTATUS AREA

exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Map string → tinyint
  const isApproved = status === "approved" ? 1 : 0;

  const sql = `
    UPDATE blog_comments
    SET is_approved = ?
    WHERE id = ?
  `;

  db.query(sql, [isApproved, id], (err, result) => {
    if (err) {
      console.error("MYSQL ERROR:", err.sqlMessage);
      return res.status(500).json({
        message: "Database error",
        error: err.sqlMessage,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({
      message: "Status updated successfully",
      is_approved: isApproved,
    });
  });
};
