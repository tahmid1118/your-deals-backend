const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const userLoginQuery = async (email) => {
  const _query = `
    SELECT
        id,
        full_name,  
        email,
        password,
        profile_img,
        is_user_active
    FROM
        user
    WHERE
        email = ?;
`;

  try {
    const [rows] = await pool.query(_query, [email]);

    if (rows.length > 0) {
      if (rows[0].is_user_active === 1) {
        return Promise.resolve(rows[0]);
      } else if (rows[0].is_user_active === 2) {
        return 2;
      } else {
        return 0;
      }
    }
    return false;
  } catch (error) {
    return Promise.reject(error);
  }
};

const generateToken = (userInfo) => {
  const token = jwt.sign(
    {
      id: userInfo.id,
      email: userInfo.email,
    },
    process.env.SECRET_ACCESS_TOKEN,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );

  return token;
};

const userLogin = async (userData) => {
  let userInfo;

  try {
    userInfo = await userLoginQuery(userData.email);
  } catch (error) {
    console.log(error);

    return Promise.reject(
      setServerResponse(
        API_STATUS_CODE.BAD_REQUEST,
        "Invalid email or password"
      )
    );
  }

  if (userInfo === 0) {
    return Promise.reject(
      setServerResponse(
        API_STATUS_CODE.BAD_REQUEST,
        "User not found or user is not active"
      )
    );
  }

  if (userInfo === false) {
    return Promise.reject(
      setServerResponse(
        API_STATUS_CODE.BAD_REQUEST,
        "Invalid email or password"
      )
    );
  }

  let isPasswordCorrect;
  try {
    isPasswordCorrect = await bcrypt.compare(
      userData.password,
      userInfo.password
    ); //compare user passwords
  } catch (error) {
    return Promise.reject(
      setServerResponse(
        API_STATUS_CODE.BAD_REQUEST,
        "Invalid email or password"
      )
    );
  }
  if (isPasswordCorrect === false) {
    return Promise.reject(
      setServerResponse(
        API_STATUS_CODE.BAD_REQUEST,
        "Invalid email or password"
      )
    );
  }
  const token = generateToken(userInfo);
  user = {
    token: token,
    id: userInfo.id,
    fullName: userInfo.full_name,
    email: userInfo.email,
    image_url: userInfo.profile_img,
  };

  return Promise.resolve(
    setServerResponse(API_STATUS_CODE.OK, "User logged in successfully", user)
  );
};

module.exports = {
  userLogin,
};
