const multer = require("multer");

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype === ("image/jpeg" || "image/jpg" || "image/png")) {
      return cb(new Error("File is Not Supported"), false);
    }
    cb(null, true);
  },
});
