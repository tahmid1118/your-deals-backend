


const multer = require("multer");
const { fileTypes, uploadFileSize } = require("./upload-file-const-value");
const { imageStorage } = require("./image-name-modifiers");

/**
 * Multer middleware for validating and storing uploaded image files.
 *
 * - Stores images using custom imageStorage configuration.
 * - Only allows image files (PNG, JPEG, JPG, WEBP) as defined in fileTypes.
 * - Limits file size based on uploadFileSize constant.
 * - Returns an error if the file is not a valid image type.
 *
 * Use for endpoints that accept image uploads and require strict validation and naming conventions.
 */
const uploadImageValidator = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (fileTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files (PNG, JPEG, JPG, WEBP) are allowed!"));
        }
    },
    limits: {
        fileSize: uploadFileSize,
    },
});

module.exports = {
    uploadImageValidator,
};
