

const path = require('path');


/**
 * @description Upload image saved file directory
 */
const imageDir = path.join(process.cwd(), "/uploads/profile-images");

/**
 * @description Upload image file mimetype
 */
const fileTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

/**
 * @description Upload file maximum size
 */
const uploadFileSize = 10240000; //10MB

module.exports = {
  imageDir,
  uploadFileSize,
  fileTypes,
};
