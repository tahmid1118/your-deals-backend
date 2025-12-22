

const path = require("path");
const multer = require("multer");
const { imageDir } = require("./upload-file-const-value");


const normalize_path_folder = path.normalize(imageDir);

/**
 * Multer storage configuration for image uploads.
 *
 * - Stores images in the normalized image directory.
 * - Filenames are uppercased, spaces replaced with underscores, and appended with a timestamp.
 * - Preserves the original file extension.
 *
 * Used for profile and project image uploads to ensure unique and standardized filenames.
 */
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, normalize_path_folder);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName =
            file.originalname
                .replace(fileExt, "")
                .toUpperCase()
                .split(" ")
                .join("_") + Date.now();
        cb(null, fileName + fileExt);
    },
});

module.exports = {
    imageStorage,
};
