const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route ✅",
    admin: req.admin
  });
});

module.exports = router;
