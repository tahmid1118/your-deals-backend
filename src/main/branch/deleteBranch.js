const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const checkBranchExists = async (branchId) => {
  const _query = `
        SELECT * 
        FROM 
            branch
        WHERE 
            branch_id = ?;
    `;

  try {
    const [rows] = await pool.query(_query, [branchId]);
    return rows.length > 0 ? true : false;
  } catch (error) {
    console.error('Error checking branch exists:', error);
    return Promise.reject(error);
  }
};

const deleteBranchQuery = async (branchId) => {
  const _query = `
        DELETE FROM 
            branch 
        WHERE 
            branch_id = ?;
    `;

  try {
    const [rows] = await pool.query(_query, [branchId]);
    if (rows.affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting branch query:', error);
    return Promise.reject(error);
  }
};

const deleteBranch = async (branchId, lg = 'en') => {
  try {
    const isExist = await checkBranchExists(branchId);
    if (isExist === false) {
      return Promise.reject(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'branch_not_found',
          lg
        )
      );
    }

    const isDeleted = await deleteBranchQuery(branchId);
    if (isDeleted) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.OK,
          'branch_deleted_successfully',
          lg
        )
      );
    }
  } catch (error) {
    console.error('Delete branch error:', error);
    return Promise.reject(
      setServerResponse(
        API_STATUS_CODE.INTERNAL_SERVER_ERROR,
        'internal_server_error',
        lg
      )
    );
  }
};

module.exports = {
  deleteBranch,
};
