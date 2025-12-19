const _ = require("lodash");
const { format } = require("date-fns");
const { setServerResponse } = require("../../common/setServerResponse");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const bcrypt = require("bcrypt");
const { pool } = require("../../../database/dbPool");

const getUserInfo = async (authData) => {
  const _query = `
        SELECT
            id,
            password
        FROM
           user
        WHERE
            id = ?
    `;
  try {
    const [row] = await pool.query(_query, [authData.id]);
    if (row.length > 0) {
      return row[0];
    }
    return false;
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateUserPasswordQuery = async (userId, hashPassword, updatedAt) => {
  const _query = `
        UPDATE
            user
        SET
            password = ?,
            updated_at = ?
        WHERE
            id = ?;
    `;
  try {
    const [result] = await pool.query(_query, [
      hashPassword,
      updatedAt,
      userId,
    ]);
    return result.affectedRows > 0 ? true : false;
  } catch (error) {
    return Promise.reject(error);
  }
};

const changeUserPassword = async (oldPassword, newPassword, authData) => {
  let hashPassword;
  const updatedAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  try {
    if (_.isEmpty(oldPassword) || _.isEmpty(newPassword)) {
      return Promise.reject(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          "Old password and new password is required"
        )
      );
    }
    const userInfo = await getUserInfo(authData);
    if (userInfo === false) {
      return Promise.reject(
        setServerResponse(API_STATUS_CODE.BAD_REQUEST, "User not found")
      );
    }
    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      userInfo.password
    );
    if (isPasswordCorrect === true) {
      hashPassword = await bcrypt.hash(newPassword, 10);
    } else {
      return Promise.reject(
        setServerResponse(API_STATUS_CODE.BAD_REQUEST, "Password mismatched")
      );
    }
    const isUpdated = await updateUserPasswordQuery(
      authData.id,
      hashPassword,
      updatedAt
    );
    if (isUpdated === true) {
      return Promise.resolve(
        setServerResponse(API_STATUS_CODE.OK, "Password updated successfully")
      );
    } else {
      return Promise.reject(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          "Failed to change password"
        )
      );
    }
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
  changeUserPassword,
};
