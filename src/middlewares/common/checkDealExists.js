const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

/**
 * Middleware to check if deal exists in database
 */
const checkDealExists = async (req, res, next) => {
  const dealId = req.body.dealId ? parseInt(req.body.dealId) : null;
  const lg = req.body.lg || 'en';

  if (!dealId) {
    return next(); // Let validator handle missing dealId
  }

  const _query = `SELECT deal_id FROM deal WHERE deal_id = ?;`;

  try {
    const [rows] = await pool.query(_query, [dealId]);
    if (rows.length === 0) {
      return res
        .status(API_STATUS_CODE.NOT_FOUND)
        .send(
          setServerResponse(
            API_STATUS_CODE.NOT_FOUND,
            'deal_not_found',
            lg
          )
        );
    }
    next();
  } catch (error) {
    console.error('Error checking deal exists:', error);
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
  checkDealExists,
};
