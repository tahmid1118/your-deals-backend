const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const getCategoryListDataQuery = async () => {
  const _query = `
        SELECT 
            category_id,
            category_title,
            category_description,
            target_customer
        FROM 
            category
        ORDER BY 
            category_title ASC;
    `;

  try {
    const [rows] = await pool.query(_query);
    return Promise.resolve(rows);
  } catch (error) {
    console.error('Error getting category list data query:', error);
    return Promise.reject(error);
  }
};

const getCategoryListData = async (lg = 'en') => {
  try {
    const categoryListData = await getCategoryListDataQuery();
    return Promise.resolve(
      setServerResponse(
        API_STATUS_CODE.OK,
        'category_list_fetched_successfully',
        lg,
        categoryListData
      )
    );
  } catch (error) {
    console.error('Get category list data error:', error);
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
  getCategoryListData,
};
