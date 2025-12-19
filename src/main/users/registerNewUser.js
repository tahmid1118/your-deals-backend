const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");
const bcrypt = require("bcrypt");
const { placeholderImagePath } = require("../../consts/staticValues");

const checkDuplicateEmail = async (email) => {
  const _query = `
    SELECT 
        email
    FROM
        user
    WHERE
        email = ?;
`;

  try {
    const [result] = await pool.query(_query, email);
    if (result.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
const insertUserDataQuery = async (userData) => {
  const _query = `
    INSERT INTO user (
        full_name,
        email,
        contact_no,
        profile_img,
        password
    )
    VALUES (?, ?, ?, ?, ?);
`;

  const _values = [
    userData.fullName,
    userData.email,
    userData.contact || null,
    placeholderImagePath,
    userData.password,
  ];

  try {
    const [rows] = await pool.query(_query, _values);
    if (rows.affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    return Promise.reject(error);
  }
};

const registerNewUser = async (userData) => {
  try {
    const isDuplicateEmail = await checkDuplicateEmail(userData.email);
    if (isDuplicateEmail) {
      return Promise.reject(
        setServerResponse(API_STATUS_CODE.BAD_REQUEST, "Email already exists")
      );
    }

    // Hash the password from userData
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    userData = { ...userData, password: hashedPassword };

    const insertedData = await insertUserDataQuery(userData);
    if (insertedData === true) {
      return Promise.resolve(
        setServerResponse(API_STATUS_CODE.OK, "Sign up is successful")
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
  registerNewUser,
};
