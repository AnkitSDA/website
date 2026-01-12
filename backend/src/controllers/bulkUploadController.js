const csv = require("csv-parser");
const { Readable } = require("stream");
const db = require("../config/db");

/* =========================
   HELPER: SLUG GENERATOR
========================= */
const makeSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* =========================
   HELPER: CSV NORMALIZER
========================= */
const normalizeRow = (rawRow) => {
  const row = {};
  Object.keys(rawRow).forEach((key) => {
    const cleanKey = key
      .replace(/^\uFEFF/, "") // BOM remove
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_"); // space → underscore

    row[cleanKey] =
      typeof rawRow[key] === "string"
        ? rawRow[key].trim()
        : rawRow[key];
  });
  return row;
};

/* =========================
   BULK UPLOAD CATEGORIES
========================= */
const bulkUploadCategories = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "CSV file required" });
  }

  const rows = [];
  const errors = [];
  let inserted = 0;
  let skipped = 0;

  Readable.from(req.file.buffer)
    .pipe(csv())
    .on("data", (row) => rows.push(row))
    .on("end", async () => {
      for (let i = 0; i < rows.length; i++) {
        const row = normalizeRow(rows[i]);

        if (!row.category_name) {
          errors.push({ row: i + 1, reason: "category_name missing" });
          continue;
        }

        const name = row.category_name;
        const slug = makeSlug(name);
        const status = row.status === "inactive" ? "inactive" : "active";

        const exists = await new Promise((resolve) => {
          db.query(
            "SELECT id FROM categories WHERE slug = ?",
            [slug],
            (err, result) => resolve(result && result.length > 0)
          );
        });

        if (exists) {
          skipped++;
          continue;
        }

        await new Promise((resolve) => {
          db.query(
            `INSERT INTO categories
             (name, slug, meta_title, meta_description, keywords, status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              name,
              slug,
              row.meta_title || null,
              row.meta_description || null,
              row.keywords || null,
              status,
            ],
            (err) => {
              if (err) {
                errors.push({ row: i + 1, reason: "DB insert failed" });
              } else {
                inserted++;
              }
              resolve();
            }
          );
        });
      }

      res.json({ success: true, inserted, skipped, errors });
    });
};

/* =========================
   BULK UPLOAD PRODUCTS
========================= */
const bulkUploadProducts = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "CSV file required" });
  }

  const rows = [];
  const errors = [];
  let inserted = 0;
  let skipped = 0;

  Readable.from(req.file.buffer)
    .pipe(csv())
    .on("data", (row) => rows.push(row))
    .on("end", async () => {
      for (let i = 0; i < rows.length; i++) {
        const row = normalizeRow(rows[i]);

        /* 🔴 REQUIRED FIELDS */
        if (!row.product_name || !row.category_slug) {
          errors.push({
            row: i + 1,
            reason: "product_name or category_slug missing",
          });
          continue;
        }

        const name = row.product_name;
        const categorySlug = row.category_slug;

        /* 🔎 CATEGORY RESOLVE */
        const category = await new Promise((resolve) => {
          db.query(
            "SELECT id FROM categories WHERE slug = ?",
            [categorySlug],
            (err, result) =>
              resolve(result && result.length ? result[0] : null)
          );
        });

        if (!category) {
          errors.push({
            row: i + 1,
            reason: `category_slug '${categorySlug}' not found`,
          });
          continue;
        }

        /* 🔁 DUPLICATE PRODUCT CHECK */
        const exists = await new Promise((resolve) => {
          db.query(
            "SELECT id FROM products WHERE name = ?",
            [name],
            (err, result) => resolve(result && result.length > 0)
          );
        });

        if (exists) {
          skipped++;
          continue;
        }

        /* 🔐 BULK-SAFE UNIQUE SLUG */
        const baseSlug = makeSlug(name);
        const slug = `${baseSlug}-${Date.now()}-${i}`;

        /* ✅ INSERT PRODUCT */
        /* ✅ INSERT PRODUCT (SCHEMA-SAFE) */
        /* ✅ INSERT PRODUCT (SCHEMA-SAFE) */
        await new Promise((resolve) => {
          db.query(
            `INSERT INTO products (
              category_id,
              name,
              image,
              slug,
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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              category.id,
              name,
              row.image || null,
              slug,
              row.short_description || null,
              row.description || null,
              row.features || null,
              row.application || null,
              row.model_number || null,
              row.meta_title || null,
              row.meta_description || null,
              row.meta_keywords || null,
              row.featured ? 1 : 0,
              row.status || "active",
            ],
            (err) => {
              if (err) {
                console.error("❌ DB ERROR:", err.sqlMessage);
                errors.push({
                  row: i + 1,
                  reason: err.sqlMessage,
                });
              } else {
                inserted++;
              }
              resolve();
            }
          );
        });
      }

      /* ✅ SEND RESPONSE AFTER LOOP */
      res.json({ success: true, inserted, skipped, errors });
    });
};


/* =========================
   EXPORTS
========================= */
module.exports = {
  bulkUploadCategories,
  bulkUploadProducts,
};
