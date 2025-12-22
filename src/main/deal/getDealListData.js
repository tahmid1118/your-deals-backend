const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const getDealListData = async (lg) => {
  const _query = `
    SELECT 
        d.deal_id,
        d.deal_title,
        d.deal_thumbnail,
        d.deal_channel,
        d.deal_type,
        d.deal_start_datetime,
        d.deal_end_datetime,
        s.shop_name,
        b.branch_name
    FROM
        deal d
    LEFT JOIN shop s ON d.shop_id = s.shop_id
    LEFT JOIN branch b ON d.branch_id = b.branch_id
    ORDER BY d.created_at DESC;
  `;

  try {
    const [rows] = await pool.query(_query);
    return Promise.resolve(
      setServerResponse(
        API_STATUS_CODE.OK,
        'deal_list_fetched_successfully',
        lg,
        rows
      )
    );
  } catch (error) {
    console.error('Error fetching deal list:', error);
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
  getDealListData,
};
