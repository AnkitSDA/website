const db = require("../config/db");

/* ===========================
   CREATE LEAD (PUBLIC)
=========================== */
exports.createLead = (req, res) => {
  const { name, email, phone, message } = req.body;

  // 🔐 Basic required validation
  if (!name || !email || !message) {
    return res.status(400).json({
      message: "Name, email and message are required"
    });
  }

  // 📞 Phone validation (your rule)
  if (phone && phone.length < 10) {
    return res.status(400).json({
      message: "Phone number must be at least 10 digits"
    });
  }

  const sql = `
    INSERT INTO leads (name, email, phone, message)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, email, phone || null, message], (err, result) => {
    if (err) {
      console.error("Create lead error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({
      message: "Message submitted successfully"
    });
  });
};

/* ===========================
   GET ALL LEADS (ADMIN)
=========================== */
exports.getLeads = (req, res) => {
  const sql = `
    SELECT *
    FROM leads
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Get leads error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
};

/* ===========================
   GET SINGLE LEAD (ADMIN)
=========================== */
exports.getLeadById = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM leads WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Get lead error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(results[0]);
  });
};

/* ===========================
   DELETE LEAD (ADMIN)
=========================== */
exports.deleteLead = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM leads WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Delete lead error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Lead deleted successfully" });
  });
};
