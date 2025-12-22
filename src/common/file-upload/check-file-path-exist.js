

const fs = require("fs");
const path = require("path");
const {
    imageDir,
    scheduleCsvDir,
    testCaseCsvDir
} = require("./upload-file-const-value");

/**
 * Middleware to check if the file save directory exists for uploads, and creates it if not.
 * Determines the upload folder based on request URL and ensures the directory exists before proceeding.
 * @returns {void}
 * @description This function checks the file save directory for uploads and creates it if it does not exist.
 */
const checkIfFileSavePathExist = async (req, res, next) => {
    let UPLOAD_FOLDER;


    if (req.originalUrl === '/uploader/upload-image') {
        UPLOAD_FOLDER = imageDir;
    }


    const normalize_path_folder = path.normalize(UPLOAD_FOLDER);

    // Ensure the folder exists or create it
    if (!fs.existsSync(normalize_path_folder)) {
        fs.mkdirSync(normalize_path_folder, { recursive: true });
    }
    next();

}

module.exports = {
    checkIfFileSavePathExist
}