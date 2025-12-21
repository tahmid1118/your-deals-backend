const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const checkShopExists = async (shopId) => {
  const _query = `
    SELECT 
        shop_id
    FROM
        shop
    WHERE
        shop_id = ?;
`;

  try {
    const [result] = await pool.query(_query, [shopId]);
    if (result.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking shop exists:', error);
    return Promise.reject(error);
  }
};

const insertBranchDataQuery = async (branchData) => {
  const _query = `
    INSERT INTO branch (
        branch_name,
        branch_location,
        branch_address,
        branch_area,
        shop_id
    )
    VALUES (?, ?, ?, ?, ?);
`;

  const _values = [
    branchData.branchName,
    branchData.branchLocation || null,
    branchData.branchAddress || null,
    branchData.branchArea || null,
    branchData.shopId,
  ];

  try {
    const [rows] = await pool.query(_query, _values);
    if (rows.affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error inserting branch data:', error);
    return Promise.reject(error);
  }
};

const createBranch = async (branchData) => {
  try {
    const shopExists = await checkShopExists(branchData.shopId);
    if (!shopExists) {
      return Promise.reject(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'shop_not_found',
          branchData.lg
        )
      );
    }

    const insertedData = await insertBranchDataQuery(branchData);
    if (insertedData === true) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.OK,
          'branch_created_successfully',
          branchData.lg
        )
      );
    }
  } catch (error) {
    console.error('Create branch error:', error);
    return Promise.reject(
      setServerResponse(
        API_STATUS_CODE.INTERNAL_SERVER_ERROR,
        'internal_server_error',
        branchData.lg
      )
    );
  }
};

module.exports = {
  createBranch,
};
