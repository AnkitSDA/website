const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, commentController.getComments);
router.delete("/:id", verifyToken, commentController.deleteComment);

// ✅ STATUS UPDATE ROUTE
router.put("/:id/status", verifyToken, commentController.updateStatus);

module.exports = router;
