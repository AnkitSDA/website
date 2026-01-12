const express = require("express");
const router = express.Router();

const seoPageController = require("../controllers/seoPageController");
const authMiddleware = require("../middleware/authMiddleware");

/* ===========================
   CREATE / UPDATE SEO PAGE (ADMIN)
=========================== */
router.post(
  "/",
  authMiddleware,
  seoPageController.upsertSeoPage
);

/* ===========================
   GET SEO PAGE BY PAGE (PUBLIC)
=========================== */
router.get("/:page", seoPageController.getSeoPageByPage);

/* ===========================
   DELETE SEO PAGE (ADMIN)
=========================== */
router.delete(
  "/:id",
  authMiddleware,
  seoPageController.deleteSeoPage
);

module.exports = router;
