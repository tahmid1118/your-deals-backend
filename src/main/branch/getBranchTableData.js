const { setServerResponse } = require("../../common/setServerResponse");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { pool } = require("../../../database/dbPool");

const totalBranchTableRowCount = async (shopId) => {
  let _query = `
        SELECT 
            COUNT(*) AS totalRows
        FROM 
            branch`;
  
  const _values = [];
  
  if (shopId) {
    _query += `
        WHERE
            shop_id = ?`;
    _values.push(shopId);
  }
  
  _query += `;`;

  try {
    const [rows] = await pool.query(_query, _values);
    if (rows.length > 0) {
      return Promise.resolve(rows[0].totalRows);
    }
    return Promise.resolve(0);
  } catch (error) {
    console.error('Error getting total branch table row count:', error);
    return Promise.reject(error);
  }
};

const getBranchTableDataQuery = async (paginationData, shopId) => {
  const sortOrder = paginationData.sortOrder === 'asc' ? 'ASC' : 'DESC';
  let _query = `
        SELECT
            b.branch_id,
            b.branch_name,
            b.branch_location,
            b.branch_address,
            b.branch_area,
            b.shop_id,
            s.shop_name,
            b.created_at,
            b.updated_at
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
            b.created_at ${sortOrder}
        LIMIT ? OFFSET ?;`;
  
  _values.push(paginationData.itemsPerPage, paginationData.offset);

  try {
    const [rows] = await pool.query(_query, _values);
    return Promise.resolve(rows);
  } catch (error) {
    console.error('Error getting branch table data query:', error);
    return Promise.reject(error);
  }
};

const getBranchTableData = async (paginationData, shopId) => {
  const language = paginationData.lg || 'en';
  try {
    const totalRows = await totalBranchTableRowCount(shopId);
    const branchData = await getBranchTableDataQuery(paginationData, shopId);

    const result = {
      metadata: {
        totalRows: totalRows,
      },
      tableData: branchData,
    };
    return Promise.resolve(
      setServerResponse(
        API_STATUS_CODE.OK,
        'branch_data_fetched_successfully',
        language,
        result
      )
    );
  } catch (error) {
    console.error('Get branch table data error:', error);
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
  getBranchTableData,
};
