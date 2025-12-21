const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const getShopListDataQuery = async () => {
  const _query = `
        SELECT 
            shop_id,
            shop_name,
            shop_details,
            shop_email,
            shop_contact,
            shop_contact_alternative
        FROM 
            shop
        ORDER BY 
            shop_name ASC;
    `;

  try {
    const [rows] = await pool.query(_query);
    return Promise.resolve(rows);
  } catch (error) {
    console.error('Error getting shop list data query:', error);
    return Promise.reject(error);
  }
};

const getShopListData = async (lg = 'en') => {
  try {
    const shopListData = await getShopListDataQuery();
    return Promise.resolve(
      setServerResponse(
        API_STATUS_CODE.OK,
        'shop_list_fetched_successfully',
        lg,
        shopListData
      )
    );
  } catch (error) {
    console.error('Get shop list data error:', error);
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
  getShopListData,
};
