

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require('../../consts/errorStatus');
const { setServerResponse } = require('../../common/setServerResponse');


/**
 * Queries the database for a user by email and returns user info or status code.
 * @param {string} email - The user's email address.
 * @returns {Promise<Object|number|boolean>} User info object if found and active, 2 if pending, 0 if inactive, false if not found.
 */
const userLoginQuery = async (email) => {
    const _query = `
        SELECT
            user_id,
            full_name,
            email,
            password,
            image_url
        FROM
            user
        WHERE
            email = ?;
        `;

    try {
        const [rows] = await pool.query(_query, [email]);
        if (rows.length > 0) {
            return Promise.resolve(rows[0]);
        }
        return false;
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * Generates a JWT token for the given user info.
 * @param {{ id: number, email: string }} userInfo - The user information for the token payload.
 * @returns {string} The generated JWT token.
 * @description This function will generate a unique user token.
 */
const generateToken = (userInfo) => {
    const token = jwt.sign(
        {
            id: userInfo.user_id,
            email: userInfo.email,
        },
        process.env.SECRET_ACCESS_TOKEN,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
        }
    );

    return token;
};


/**
 * Handles user login by validating credentials and returning a server response with a token on success.
 * @param {{ lg: string, email: string, password: string }} userData - The user login data.
 * @returns {Promise<Object>} The server response indicating success or failure, with a token and user info on success.
 * @description This function handles user login by validated user data.
 */
const userLogin = async (userData) => {
    let userInfo;

    try {
        userInfo = await userLoginQuery(userData.email);
        console.log('User found:', userInfo ? 'Yes' : 'No');
        console.log('User info:', JSON.stringify(userInfo));
    } catch (error) {
        console.error('Error querying user:', error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_email_or_password',
                userData.lg,
            )
        );
    }

    if (userInfo === false) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_email_or_password',
                userData.lg,
            )
        );
    }

    let isPasswordCorrect;
    try {
        isPasswordCorrect = await bcrypt.compare(
            userData.password,
            userInfo.password
        ); //compare user passwords
        console.log('Password match:', isPasswordCorrect);
    } catch (error) {
        console.error('Password comparison error:', error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_email_or_password',
                userData.lg,
            )
        );
    }
    if (isPasswordCorrect === false) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_email_or_password',
                userData.lg,
            )
        );
    }
    const token = generateToken(userInfo);
    user = {
        token: token,
        id: userInfo.user_id,
        fullName: userInfo.full_name,
        email: userInfo.email,
        imageUrl: userInfo.image_url,
    }

    return Promise.resolve(
        setServerResponse(
            API_STATUS_CODE.OK,
            'user_logged_in_successfully',
            userData.lg,
            user
        )
    );
}

module.exports = {
    userLogin
};