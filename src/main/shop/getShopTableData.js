const { setServerResponse } = require("../../common/setServerResponse");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { pool } = require("../../../database/dbPool");

const totalShopTableRowCount = async () => {
  const _query = `
        SELECT 
            COUNT(*) AS totalRows
        FROM 
            shop;
    `;

  try {
    const [rows] = await pool.query(_query);
    if (rows.length > 0) {
      return Promise.resolve(rows[0].totalRows);
    }
    return Promise.resolve(0);
  } catch (error) {
    console.error('Error getting total shop table row count:', error);
    return Promise.reject(error);
  }
};

const getShopTableDataQuery = async (paginationData) => {
  const sortOrder = paginationData.sortOrder === 'asc' ? 'ASC' : 'DESC';
  const _query = `
        SELECT
            shop_id,
            shop_name,
            shop_details,
            shop_email,
            shop_contact,
            shop_contact_alternative,
            created_at,
            updated_at
        FROM
            shop
        ORDER BY
            created_at ${sortOrder}
        LIMIT ? OFFSET ?;
    `;
  const _values = [paginationData.itemsPerPage, paginationData.offset];

  try {
    const [rows] = await pool.query(_query, _values);
    return Promise.resolve(rows);
  } catch (error) {
    console.error('Error getting shop table data query:', error);
    return Promise.reject(error);
  }
};

const getShopTableData = async (paginationData) => {
  const language = paginationData.lg || 'en';
  try {
    const totalRows = await totalShopTableRowCount();
    const shopData = await getShopTableDataQuery(paginationData);

    const result = {
      metadata: {
        totalRows: totalRows,
      },
      tableData: shopData,
    };
    return Promise.resolve(
      setServerResponse(
        API_STATUS_CODE.OK,
        'shop_data_fetched_successfully',
        language,
        result
      )
    );
  } catch (error) {
    console.error('Get shop table data error:', error);
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
  getShopTableData,
};
