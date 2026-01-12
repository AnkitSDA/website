const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const authMiddleware = require("../middleware/authMiddleware");

// Public
router.post("/", leadController.createLead);

// Admin (JWT protected)
router.get("/", authMiddleware, leadController.getLeads);
router.get("/:id", authMiddleware, leadController.getLeadById);
router.delete("/:id", authMiddleware, leadController.deleteLead);

module.exports = router;
