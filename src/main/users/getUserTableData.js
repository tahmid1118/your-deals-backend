const { setServerResponse } = require("../../common/setServerResponse");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { pool } = require("../../../database/dbPool");

const totalUserTableRowCount = async () => {
  const _query = `
        SELECT 
            COUNT(*) AS totalRows
        FROM 
            user;
    `;

  try {
    const [rows] = await pool.query(_query);
    if (rows.length > 0) {
      return Promise.resolve(rows[0].totalRows);
    }
    return Promise.resolve(0);
  } catch (error) {
    console.error('Error getting total user table row count:', error);
    return Promise.reject(error);
  }
};

const getUserTableDataQuery = async (paginationData) => {
  const _query = `
        SELECT
            user_id,
           full_name,
            email,
            created_at,
            updated_at
        FROM
            user
        ORDER BY
            created_at DESC
        LIMIT ? OFFSET ?;
    `;
  const _values = [paginationData.itemsPerPage, paginationData.offset];

  try {
    const [rows] = await pool.query(_query, _values);
    return Promise.resolve(rows);
  } catch (error) {
    console.error('Error getting user table data query:', error);
    return Promise.reject(error);
  }
};

const getUserTableData = async (paginationData) => {
  const language = paginationData.lg || 'en';
  try {
    const totalRows = await totalUserTableRowCount();
    const userData = await getUserTableDataQuery(paginationData);

    const result = {
      metadata: {
        totalRows: totalRows,
      },
      tableData: userData,
    };
    return Promise.resolve(
      setServerResponse(
        API_STATUS_CODE.OK,
        'user_data_fetched_successfully',
        language,
        result
      )
    );
  } catch (error) {
    console.error('Get user table data error:', error);
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
  getUserTableData,
};
