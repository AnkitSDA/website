const db = require("../config/db");

/* =========================
   CREATE BLOG
========================= */
exports.createBlog = (req, res) => {
  const {
    title,
    slug,
    description,
    metaTitle,
    metaDescription,
    keywords,
    status
  } = req.body;

  const image = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO blogs
    (title, slug, content, meta_title, meta_description, keywords, image, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      slug,
      description, // ✅ FIXED
      metaTitle || null,
      metaDescription || null,
      keywords || null,
      image,
      status || "published"
    ],
    (err, result) => {
      if (err) {
        console.error("CREATE BLOG ERROR:", err);
        return res.status(500).json({ message: "Blog create failed" });
      }

      res.json({ message: "Blog created successfully" });
    }
  );
};


/* =========================
   GET ALL BLOGS
========================= */
exports.getBlogs = (req, res) => {
  db.query(
    "SELECT id,title,slug,status,created_at FROM blogs ORDER BY id DESC",
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
};


//FRONTEND 

exports.getPublishedBlogs = (req, res) => {
  db.query(
    "SELECT id,title,slug,created_at FROM blogs WHERE status='published' ORDER BY id DESC",
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
};


/* =========================
   GET BLOG BY SLUG
========================= */
exports.getBlogBySlug = (req, res) => {
  const { slug } = req.params;

  db.query(
    "SELECT * FROM blogs WHERE slug=? AND status='published' LIMIT 1",
    [slug],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (!rows.length) return res.status(404).json({ message: "Not found" });
      res.json(rows[0]);
    }
  );
};

/* =========================
   UPDATE BLOG
========================= */
exports.updateBlog = (req, res) => {
  const { id } = req.params;

  const {
    title,
    content,
    meta_title,
    meta_description,
    status
  } = req.body;

  const image = req.file ? req.file.filename : null;

  // 1️⃣ Fetch existing blog
  db.query(
    "SELECT * FROM blogs WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (rows.length === 0)
        return res.status(404).json({ message: "Blog not found" });

      const existing = rows[0];

      // 2️⃣ Use old values if new is empty
      const updatedData = {
        title: title || existing.title,
        content: content || existing.content,
        meta_title: meta_title || existing.meta_title,
        meta_description:
          meta_description || existing.meta_description,
        status: status || existing.status,
        image: image || existing.image
      };

      // 3️⃣ Update safely
      db.query(
        `UPDATE blogs SET
          title=?,
          content=?,
          meta_title=?,
          meta_description=?,
          status=?,
          image=?
         WHERE id=?`,
        [
          updatedData.title,
          updatedData.content,
          updatedData.meta_title,
          updatedData.meta_description,
          updatedData.status,
          updatedData.image,
          id
        ],
        () => res.json({ message: "Blog updated safely" })
      );
    }
  );
};


/* =========================
   DELETE BLOG
========================= */
exports.deleteBlog = (req, res) => {
  db.query("DELETE FROM blogs WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted" });
  });
};

// ADMIN – Get blog by ID (for edit)
exports.getBlogById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM blogs WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (rows.length === 0)
        return res.status(404).json({ message: "Blog not found" });

      res.json(rows[0]);
    }
  );
};

exports.getBlogById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM blogs WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (rows.length === 0)
        return res.status(404).json({ message: "Blog not found" });

      res.json(rows[0]);
    }
  );
};

