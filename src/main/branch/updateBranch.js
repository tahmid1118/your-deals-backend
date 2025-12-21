const { format } = require("date-fns");
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

const updateBranchDataQuery = async (branchData) => {
  let _query = `UPDATE branch SET `;
  const _values = [];

  if (branchData.branchName) {
    _query += `branch_name = ? `;
    _values.push(branchData.branchName);
  }

  if (branchData.branchLocation !== undefined) {
    if (_values.length > 0) _query += ", ";
    _query += `branch_location = ? `;
    _values.push(branchData.branchLocation);
  }

  if (branchData.branchAddress !== undefined) {
    if (_values.length > 0) _query += ", ";
    _query += `branch_address = ? `;
    _values.push(branchData.branchAddress);
  }

  if (branchData.branchArea !== undefined) {
    if (_values.length > 0) _query += ", ";
    _query += `branch_area = ? `;
    _values.push(branchData.branchArea);
  }

  if (branchData.shopId) {
    if (_values.length > 0) _query += ", ";
    _query += `shop_id = ? `;
    _values.push(branchData.shopId);
  }

  if (_values.length > 0) {
    _query += ", ";
    _query += `updated_at = ? `;
    _values.push(branchData.updatedAt);
  }

  // Final WHERE condition
  _query += ` WHERE branch_id = ?`;
  _values.push(branchData.branchId);

  try {
    const [rows] = await pool.query(_query, _values);
    if (rows.affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating branch data query:', error);
    return Promise.reject(error);
  }
};

const updateBranch = async (branchData) => {
  const updatedAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  branchData = { ...branchData, updatedAt: updatedAt };
  const language = branchData.lg || 'en';
  try {
    const isExist = await checkBranchExists(branchData.branchId);
    if (isExist === false) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'branch_not_found',
          language
        )
      );
    }
    const isUpdated = await updateBranchDataQuery(branchData);
    if (isUpdated) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.OK,
          'branch_updated_successfully',
          language
        )
      );
    }
  } catch (error) {
    console.error('Update branch error:', error);
    return Promise.reject(
      setServerResponse(
        API_STATUS_CODE.INTERNAL_SERVER_ERROR,
        'internal_server_error',
        language
      )
    );
  }
};

module.exports = {
  updateBranch,
};
