const { setServerResponse } = require("../../common/setServerResponse");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { pool } = require("../../../database/dbPool");

const totalCategoryTableRowCount = async () => {
  const _query = `
        SELECT 
            COUNT(*) AS totalRows
        FROM 
            category;
    `;

  try {
    const [rows] = await pool.query(_query);
    if (rows.length > 0) {
      return Promise.resolve(rows[0].totalRows);
    }
    return Promise.resolve(0);
  } catch (error) {
    console.error('Error getting total category table row count:', error);
    return Promise.reject(error);
  }
};

const getCategoryTableDataQuery = async (paginationData) => {
  const _query = `
        SELECT
            category_id,
            category_title,
            category_description,
            target_customer,
            created_at,
            updated_at
        FROM
            category
        ORDER BY
            created_at DESC
        LIMIT ? OFFSET ?;
    `;
  const _values = [paginationData.itemsPerPage, paginationData.offset];

  try {
    const [rows] = await pool.query(_query, _values);
    return Promise.resolve(rows);
  } catch (error) {
    console.error('Error getting category table data query:', error);
    return Promise.reject(error);
  }
};

const getCategoryTableData = async (paginationData) => {
  const language = paginationData.lg || 'en';
  try {
    const totalRows = await totalCategoryTableRowCount();
    const categoryData = await getCategoryTableDataQuery(paginationData);

    const result = {
      metadata: {
        totalRows: totalRows,
      },
      tableData: categoryData,
    };
    return Promise.resolve(
      setServerResponse(
        API_STATUS_CODE.OK,
        'category_data_fetched_successfully',
        language,
        result
      )
    );
  } catch (error) {
    console.error('Get category table data error:', error);
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
  getCategoryTableData,
};
