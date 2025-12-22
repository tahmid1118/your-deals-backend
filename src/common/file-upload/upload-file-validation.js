


const multer = require("multer");
// const { storage } = require("../nameStorage/storage-filename-modifiers");
const { uploadFileSize } = require("./upload-file-const-value");

/**
 * Multer middleware for validating uploaded CSV files.
 *
 * - Stores files in memory.
 * - Only allows files with mimetype 'text/csv'.
 * - Limits file size based on uploadFileSize constant.
 * - Returns an error if the file is not a CSV.
 *
 * Use for endpoints that accept CSV uploads and require strict validation.
 */
const uploadFileValidator = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      cb(new Error("ONly .csv file is allowed!"));
    }
  },
  limits: {
    fileSize: uploadFileSize,
  },
});

module.exports = {
  uploadFileValidator,
};
