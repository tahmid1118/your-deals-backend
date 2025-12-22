const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

/**
 * Middleware to check if shop exists in database
 */
const checkShopExists = async (req, res, next) => {
  const shopId = req.body.shopId ? parseInt(req.body.shopId) : null;
  const lg = req.body.lg || 'en';

  if (!shopId) {
    return next(); // Let validator handle missing shopId
  }

  const _query = `SELECT shop_id FROM shop WHERE shop_id = ?;`;

  try {
    const [rows] = await pool.query(_query, [shopId]);
    if (rows.length === 0) {
      return res
        .status(API_STATUS_CODE.NOT_FOUND)
        .send(
          setServerResponse(
            API_STATUS_CODE.NOT_FOUND,
            'shop_not_found',
            lg
          )
        );
    }
    next();
  } catch (error) {
    console.error('Error checking shop exists:', error);
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
  checkShopExists,
};
