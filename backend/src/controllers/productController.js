const fs = require("fs");          // ✅ REQUIRED
const path = require("path");      // ✅ REQUIRED
const db = require("../config/db");
const slugify = require("slugify");

/* ===========================
   CREATE PRODUCT
=========================== */
exports.createProduct = (req, res) => {
  const {
    category_id,
    name,
    short_description,
    description,
    features,
    application,
    model_number,
    meta_title,
    meta_description,
    meta_keywords,
    featured = 0,
    status = "active"
  } = req.body;

  if (!category_id || !name) {
    return res.status(400).json({
      message: "Category and product name are required"
    });
  }

  const slug = slugify(name, { lower: true });
  const image = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO products
    (
      category_id,
      name,
      slug,
      image,
      short_description,
      description,
      features,
      application,
      model_number,
      meta_title,
      meta_description,
      meta_keywords,
      featured,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    category_id,
    name,
    slug,
    image,
    short_description,
    description,
    features,
    application,
    model_number,
    meta_title,
    meta_description,
    meta_keywords,
    featured,
    status
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("CREATE PRODUCT ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({
      message: "Product created successfully",
      id: result.insertId
    });
  });
};

/* ===========================
   UPDATE PRODUCT
=========================== */
exports.updateProduct = (req, res) => {
  const { id } = req.params;

  let {
    name,
    slug,
    category_id,
    short_description,
    description,
    model_number,
    meta_title,
    meta_description,
    meta_keywords,
    status,
  } = req.body;

  // ✅ slug fallback
  if (!slug && name) {
    slug = makeSlug(name);
  }

  // ✅ NEW IMAGE (if uploaded)
  const newImage = req.file ? req.file.filename : null;

  // 🔒 Slug uniqueness
  const checkSlugSql =
    "SELECT id FROM products WHERE slug = ? AND id != ?";

  db.query(checkSlugSql, [slug, id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    // 🔍 Get old image (for delete)
    db.query(
      "SELECT image FROM products WHERE id = ?",
      [id],
      (err, rows) => {
        if (err) return res.status(500).json(err);

        const oldImage = rows[0]?.image;

        let updateSql = `
          UPDATE products SET
            name = ?,
            slug = ?,
            category_id = ?,
            short_description = ?,
            description = ?,
            model_number = ?,
            meta_title = ?,
            meta_description = ?,
            meta_keywords = ?,
            status = ?
        `;

        const values = [
          name,
          slug,
          category_id,
          short_description,
          description,
          model_number,
          meta_title,
          meta_description,
          meta_keywords,
          status
        ];

        // ✅ IMAGE UPDATE ONLY IF NEW IMAGE EXISTS
        if (newImage) {
          updateSql += `, image = ?`;
          values.push(newImage);
        }

        updateSql += ` WHERE id = ?`;
        values.push(id);

        db.query(updateSql, values, (err) => {
          if (err) return res.status(500).json(err);

          // 🗑️ Delete old image from disk
          if (newImage && oldImage) {
            const oldPath = path.join(
              __dirname,
              "../../uploads/products",
              oldImage
            );
            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
            }
          }

          res.json({
            success: true,
            message: "Product updated successfully",
          });
        });
      }
    );
  });
};

/* ===========================
   BULK DELETE PRODUCTS
=========================== */
exports.bulkDeleteProducts = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No product IDs provided" });
  }

  try {
    // 🔐 Build safe placeholders (?, ?, ?)
    const placeholders = ids.map(() => "?").join(",");

    // 1️⃣ Fetch images
    const [products] = await db.promise().query(
      `SELECT image FROM products WHERE id IN (${placeholders})`,
      ids
    );

    // 2️⃣ Delete images from disk
    products.forEach((p) => {
      if (p.image) {
        const imgPath = path.join(
          __dirname,
          "../../uploads/products",
          p.image
        );
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      }
    });

    // 3️⃣ Delete products
    await db.promise().query(
      `DELETE FROM products WHERE id IN (${placeholders})`,
      ids
    );

    return res.json({
      message: `${ids.length} products deleted successfully`,
    });

  } catch (err) {
    console.error("🔥 BULK DELETE MYSQL ERROR:", err);
    return res.status(500).json({
      message: "Database error",
      error: err.sqlMessage || err.message,
    });
  }
};
/* ===========================
   DELETE PRODUCT
=========================== */
exports.deleteProduct = (req, res) => {
  db.query(
    "DELETE FROM products WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.error("DELETE PRODUCT ERROR:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    }
  );
};

/* ===========================
   GET ALL PRODUCTS (ADMIN LIST)
=========================== */
exports.getProducts = (req, res) => {
  const sql = `
    SELECT
      p.id,
      p.name,
      p.status,
      p.featured,
      c.name AS category_name,

      -- ✅ image fallback logic
      COALESCE(
        p.image,
        (
          SELECT pi.image
          FROM product_images pi
          WHERE pi.product_id = p.id
          ORDER BY pi.is_primary DESC, pi.id ASC
          LIMIT 1
        )
      ) AS display_image

    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("GET PRODUCTS ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
};

/* ===========================
   GET PRODUCT BY ID (EDIT)
=========================== */
exports.getProductById = (req, res) => {
  const sql = `
    SELECT *
    FROM products
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error("GET PRODUCT ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(results[0]);
  });
};

/* ===========================
   GET FEATURED PRODUCTS
=========================== */
exports.getFeaturedProducts = (req, res) => {
  const sql = `
    SELECT
      id,
      name,
      slug,
      image,
      short_description,
      meta_title,
      meta_description
    FROM products
    WHERE featured = 1
      AND status = 'active'
    ORDER BY updated_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("GET FEATURED ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const products = results.map(p => ({
      ...p,
      image: p.image
        ? `${req.protocol}://${req.get("host")}/uploads/products/${p.image}`
        : null
    }));

    res.json(products);
  });
};

/* ===========================
   GET PRODUCTS BY CATEGORY
=========================== */
exports.getProductsByCategory = (req, res) => {
  const sql = `
    SELECT
      p.id,
      p.name,
      p.slug,
      p.image,
      p.short_description
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE c.slug = ?
      AND p.status = 'active'
  `;

  db.query(sql, [req.params.slug], (err, results) => {
    if (err) {
      console.error("GET BY CATEGORY ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const products = results.map(p => ({
      ...p,
      image: p.image
        ? `${req.protocol}://${req.get("host")}/uploads/products/${p.image}`
        : null
    }));

    res.json(products);
  });
};
