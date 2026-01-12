const db = require("../config/db");

/* ===========================
   GET DASHBOARD STATS (ADMIN)
=========================== */
exports.getDashboardStats = (req, res) => {
  const queries = {
    blogs: "SELECT COUNT(*) AS total FROM blogs",
    products: "SELECT COUNT(*) AS total FROM products",
    categories: "SELECT COUNT(*) AS total FROM categories",
    leads: "SELECT COUNT(*) AS total FROM leads",
  };

  const stats = {};

  db.query(queries.blogs, (err, blogResult) => {
    if (err) return res.status(500).json({ message: "DB error (blogs)" });

    stats.blogs = blogResult[0].total;

    db.query(queries.products, (err, productResult) => {
      if (err) return res.status(500).json({ message: "DB error (products)" });

      stats.products = productResult[0].total;

      db.query(queries.categories, (err, categoryResult) => {
        if (err) return res.status(500).json({ message: "DB error (categories)" });

        stats.categories = categoryResult[0].total;

        db.query(queries.leads, (err, leadResult) => {
          if (err) return res.status(500).json({ message: "DB error (leads)" });

          stats.leads = leadResult[0].total;

          res.json(stats);
        });
      });
    });
  });
};
