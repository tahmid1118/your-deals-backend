const { setServerResponse } = require("../../common/setServerResponse");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { pool } = require("../../../database/dbPool");

const getUserListDataQuery = async () => {
  const _query = `
        SELECT
            user_id,
            full_name,
            email
        FROM
            user;
    `;
  try {
    const [rows] = await pool.query(_query);
    return rows;
  } catch (error) {
    console.error('Error getting user list data query:', error);
    return Promise.reject(error);
  }
};

const getUserListData = async (language = 'en') => {
  try {
    const userList = await getUserListDataQuery();
    return Promise.resolve(
      setServerResponse(
        API_STATUS_CODE.OK,
        'user_data_fetched_successfully',
        language,
        userList
      )
    );
  } catch (error) {
    console.error('Get user list data error:', error);
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
  getUserListData,
};
