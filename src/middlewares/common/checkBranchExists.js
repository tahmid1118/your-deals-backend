const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

/**
 * Middleware to check if branch exists in database
 */
const checkBranchExists = async (req, res, next) => {
  const branchId = req.body.branchId ? parseInt(req.body.branchId) : null;
  const lg = req.body.lg || 'en';

  if (!branchId) {
    return next(); // Branch is optional
  }

  const _query = `SELECT branch_id FROM branch WHERE branch_id = ?;`;

  try {
    const [rows] = await pool.query(_query, [branchId]);
    if (rows.length === 0) {
      return res
        .status(API_STATUS_CODE.NOT_FOUND)
        .send(
          setServerResponse(
            API_STATUS_CODE.NOT_FOUND,
            'branch_not_found',
            lg
          )
        );
    }
    next();
  } catch (error) {
    console.error('Error checking branch exists:', error);
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
  checkBranchExists,
};
