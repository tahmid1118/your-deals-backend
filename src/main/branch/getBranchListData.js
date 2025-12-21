const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const getBranchListDataQuery = async (shopId) => {
  let _query = `
        SELECT 
            b.branch_id,
            b.branch_name,
            b.branch_location,
            b.branch_address,
            b.branch_area,
            b.shop_id,
            s.shop_name
        FROM 
            branch b
        LEFT JOIN
            shop s ON b.shop_id = s.shop_id`;
  
  const _values = [];
  
  if (shopId) {
    _query += `
        WHERE
            b.shop_id = ?`;
    _values.push(shopId);
  }
  
  _query += `
        ORDER BY 
            b.branch_name ASC;`;

  try {
    const [rows] = await pool.query(_query, _values);
    return Promise.resolve(rows);
  } catch (error) {
    console.error('Error getting branch list data query:', error);
    return Promise.reject(error);
  }
};

const getBranchListData = async (shopId, lg = 'en') => {
  try {
    const branchListData = await getBranchListDataQuery(shopId);
    return Promise.resolve(
      setServerResponse(
        API_STATUS_CODE.OK,
        'branch_list_fetched_successfully',
        lg,
        branchListData
      )
    );
  } catch (error) {
    console.error('Get branch list data error:', error);
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
  getBranchListData,
};
