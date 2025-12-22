

const multer = require("multer");
const { API_STATUS_CODE } = require("../../consts/errorStatus");

/**
 * Express middleware to handle file upload errors, specifically Multer errors.
 *
 * @param {Error} err - The error object, may be a Multer error or other error.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * Responds with BAD_REQUEST and a standardized error message for Multer errors or other upload errors.
 * Calls next() if no error is present.
 */
const errorCheck = (err, req, res, next) => {
	if (err) {
		if (err instanceof multer.MulterError) {
			return res.status(API_STATUS_CODE.BAD_REQUEST).send({
				err,
				status: "failed",
				message: "Failed to upload file",
			});
		} else {
			return res.status(API_STATUS_CODE.BAD_REQUEST).send({
				status: "failed",
				message: err?.message
			});
		}
	} else {
		next();
	}
};

module.exports = {
	errorCheck,
};
