const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

/* ===========================
   CREATE APPLICATION (ADMIN)
=========================== */
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  applicationController.createApplication
);

/* ===========================
   GET APPLICATIONS (PUBLIC)
=========================== */
router.get("/", applicationController.getApplications);

/* ===========================
   DELETE APPLICATION (ADMIN)
=========================== */
router.delete(
  "/:id",
  authMiddleware,
  applicationController.deleteApplication
);

module.exports = router;
