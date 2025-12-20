const { format } = require("date-fns");
const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const checkUserExists = async (userId) => {
  const _query = `
        SELECT * 
        FROM 
            user
        WHERE 
            user_id = ?;
    `;

  try {
    const [rows] = await pool.query(_query, [userId]);
    return rows.length > 0 ? true : false;
  } catch (error) {
    console.error('Error checking user exists:', error);
    return Promise.reject(error);
  }
};

const updateUserDataQuery = async (userData) => {
  let _query = `UPDATE user SET `;
  const _values = [];

  if (userData.fullName) {
    _query += `full_name = ? `;
    _values.push(userData.fullName);
  }

  if (userData.phone) {
    if (_values.length > 0) _query += ", ";
    _query += `contact_no = ? `;
    _values.push(userData.phone);
  }

  if (_values.length > 0) {
    _query += ", ";
    _query += `updated_at = ? `;
    _values.push(userData.updatedAt);
  }

  // Final WHERE condition
  _query += ` WHERE user_id = ?`;
  _values.push(userData.userId);

  try {
    const [rows] = await pool.query(_query, _values);
    if (rows.affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating user data query:', error);
    return Promise.reject(error);
  }
};

const updatePersonalInfo = async (userData) => {
  const updatedAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  userData = { ...userData, updatedAt: updatedAt };
  const language = userData.lg || 'en';
  try {
    const isExist = await checkUserExists(userData.userId);
    if (isExist === false) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'user_not_found',
          language
        )
      );
    }
    const isUpdated = await updateUserDataQuery(userData);
    if (isUpdated) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.OK,
          'profile_updated_successfully',
          language
        )
      );
    }
  } catch (error) {
    console.error('Update personal info error:', error);
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
  updatePersonalInfo,
};
