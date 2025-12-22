const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

/**
 * Middleware to check if category exists in database
 */
const checkCategoryExists = async (req, res, next) => {
  const categoryId = req.body.categoryId ? parseInt(req.body.categoryId) : null;
  const lg = req.body.lg || 'en';

  if (!categoryId) {
    return next(); // Let validator handle missing categoryId
  }

  const _query = `SELECT category_id FROM category WHERE category_id = ?;`;

  try {
    const [rows] = await pool.query(_query, [categoryId]);
    if (rows.length === 0) {
      return res
        .status(API_STATUS_CODE.NOT_FOUND)
        .send(
          setServerResponse(
            API_STATUS_CODE.NOT_FOUND,
            'category_not_found',
            lg
          )
        );
    }
    next();
  } catch (error) {
    console.error('Error checking category exists:', error);
    return res
      .status(API_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send(
        setServerResponse(
          API_STATUS_CODE.INTERNAL_SERVER_ERROR,
          'internal_server_error',
          lg
        )
      );
  }
};

module.exports = {
  checkCategoryExists,
};
