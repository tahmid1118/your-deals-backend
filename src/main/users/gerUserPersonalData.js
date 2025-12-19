const { setServerResponse } = require("../../common/setServerResponse");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { pool } = require("../../../database/dbPool");

const getUserPersonalData = async (authData) => {
  const _query = `
    SELECT
        id,
        full_name,
        email,
        contact_no,
        profile_img,
        created_at,
        updated_at
    FROM
        user
    WHERE
        id = ? AND
        is_user_active = 1 AND
        email = ?
`;

  const _values = [authData.id, authData.email];
  try {
    const [rows] = await pool.query(_query, _values);
    return rows[0];
  } catch (error) {
    return Promise.reject(error);
  }
};

const getPersonalData = async (authData) => {
  try {
    const userData = await getUserPersonalData(authData);
    if (!userData) {
      return Promise.reject(
        setServerResponse(API_STATUS_CODE.BAD_REQUEST, "User not found")
      );
    }
    return Promise.resolve(
      setServerResponse(
        API_STATUS_CODE.OK,
        "Data fetched successfully",
        userData
      )
    );
  } catch (error) {
    return Promise.reject(
      setServerResponse(
        API_STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Internal server error"
      )
    );
  }
};

module.exports = {
  getPersonalData,
};
