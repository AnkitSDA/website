const multer = require("multer");

const storage = multer.memoryStorage();

const uploadCsv = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.endsWith(".csv")) {
      return cb(new Error("Only CSV files are allowed"));
    }
    cb(null, true);
  },
});

module.exports = uploadCsv;
