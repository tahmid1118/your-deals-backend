const { setServerResponse } = require("../../common/setServerResponse");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { pool } = require("../../../database/dbPool");

const getUserListDataQuery = async () => {
  const _query = `
        SELECT
            id,
            full_name,
            email
        FROM
            user
        WHERE
            is_user_active = 1;
    `;
  try {
    const [rows] = await pool.query(_query);
    return rows;
  } catch (error) {
    return Promise.resolve(error);
  }
};

const getUserListData = async () => {
  try {
    const userList = await getUserListDataQuery();
    return Promise.resolve(
      setServerResponse(
        API_STATUS_CODE.OK,
        "User data fetched successfully",
        userList
      )
    );
  } catch (error) {
    return Promise.resolve(
      setServerResponse(
        API_STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Internal server error"
      )
    );
  }
};

module.exports = {
  getUserListData,
};
