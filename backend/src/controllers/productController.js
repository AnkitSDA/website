const db = require("../config/db");
const slugify = require("slugify");

// UPDATE PRODUCT
exports.updateProduct = (req, res) => {
  const { id } = req.params;

  const {
    name,
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
  } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Product name is required" });
  }

  const slug = slugify(name, { lower: true });

  const sql = `
    UPDATE products SET
      name = ?,
      slug = ?,
      short_description = ?,
      description = ?,
      features = ?,
      application = ?,
      model_number = ?,
      meta_title = ?,
      meta_description = ?,
      meta_keywords = ?,
      featured = ?,
      status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name,
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
      status,
      id
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product updated successfully" });
    }
  );
};

// GET FEATURED PRODUCTS
exports.getFeaturedProducts = (req, res) => {
  const sql = `
    SELECT 
      p.id,
      p.name,
      p.slug,
      p.short_description,
      p.meta_title,
      p.meta_description,
      MIN(pi.image) AS image
    FROM products p
    LEFT JOIN product_images pi 
      ON p.id = pi.product_id
    WHERE p.featured = 1 
      AND p.status = 'active'
    GROUP BY p.id
    ORDER BY p.updated_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    const products = results.map(p => ({
      ...p,
      image: p.image
        ? `${req.protocol}://${req.get("host")}/uploads/${p.image}`
        : null
    }));

    res.json(products);
  });
};


// GET PRODUCT BY SLUG (SEO)
exports.getProductBySlug = (req, res) => {
  const { slug } = req.params;

  const sql = `
    SELECT 
      p.*, 
      pi.image
    FROM products p
    LEFT JOIN product_images pi 
      ON p.id = pi.product_id
    WHERE p.slug = ?
  `;

  db.query(sql, [slug], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = {
      ...results[0],
      images: results
        .filter(r => r.image)
        .map(r => ({
          url: `${req.protocol}://${req.get("host")}/uploads/${r.image}`
        }))
    };

    delete product.image;

    res.json(product);
  });
};


// GET SINGLE PRODUCT WITH IMAGES
exports.getProductWithImages = (req, res) => {
  const productId = req.params.id;

  const sql = `
    SELECT 
      p.*, 
      pi.image 
    FROM products p
    LEFT JOIN product_images pi 
      ON p.id = pi.product_id
    WHERE p.id = ?
  `;

  db.query(sql, [productId], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Group images
    const product = {
      ...results[0],
      images: results
        .filter(r => r.image)
        .map(r => ({
          url: `${req.protocol}://${req.get("host")}/uploads/${r.image}`
        }))
    };

    delete product.image;

    res.json(product);
  });
};


// CREATE PRODUCT
exports.createProduct = (req, res) => {
  const { category_id, name, description, features, application } = req.body;

  if (!category_id || !name) {
    return res.status(400).json({ message: "Category and name are required" });
  }

  const slug = slugify(name, { lower: true });

  const sql = `
    INSERT INTO products
    (category_id, name, slug, description, features, application)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [category_id, name, slug, description, features, application],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Product created successfully" });
    }
  );
};

// GET ALL PRODUCTS
exports.getProducts = (req, res) => {
  db.query(
    `
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.id DESC
    `,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// GET PRODUCT BY SLUG
exports.getProductBySlug = (req, res) => {
  db.query(
    `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ?
    `,
    [req.params.slug],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results[0]);
    }
  );
};

// GET PRODUCTS BY CATEGORY
exports.getProductsByCategory = (req, res) => {
  db.query(
    `
    SELECT p.*
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE c.slug = ?
    `,
    [req.params.slug],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// UPDATE PRODUCT
exports.updateProduct = (req, res) => {
  const { name, description, features, application } = req.body;
  const slug = slugify(name, { lower: true });

  const sql = `
    UPDATE products
    SET name=?, slug=?, description=?, features=?, application=?
    WHERE id=?
  `;

  db.query(
    sql,
    [name, slug, description, features, application, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Product updated successfully" });
    }
  );
};

// DELETE PRODUCT
exports.deleteProduct = (req, res) => {
  db.query(
    "DELETE FROM products WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Product deleted successfully" });
    }
  );
};
