const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const checkDuplicateShopEmail = async (shopEmail) => {
  if (!shopEmail) return false;
  
  const _query = `
    SELECT 
        shop_email
    FROM
        shop
    WHERE
        shop_email = ?;
`;

  try {
    const [result] = await pool.query(_query, shopEmail);
    if (result.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking duplicate shop email:', error);
    return Promise.reject(error);
  }
};

const insertShopDataQuery = async (shopData) => {
  const _query = `
    INSERT INTO shop (
        shop_name,
        shop_details,
        shop_email,
        shop_contact,
        shop_contact_alternative
    )
    VALUES (?, ?, ?, ?, ?);
`;

  const _values = [
    shopData.shopName,
    shopData.shopDetails || null,
    shopData.shopEmail || null,
    shopData.shopContact || null,
    shopData.shopContactAlternative || null,
  ];

  try {
    const [rows] = await pool.query(_query, _values);
    if (rows.affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error inserting shop data:', error);
    return Promise.reject(error);
  }
};

const createShop = async (shopData) => {
  try {
    if (shopData.shopEmail) {
      const isDuplicateShopEmail = await checkDuplicateShopEmail(shopData.shopEmail);
      if (isDuplicateShopEmail) {
        return Promise.reject(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'shop_email_already_exists',
            shopData.lg
          )
        );
      }
    }

    const insertedData = await insertShopDataQuery(shopData);
    if (insertedData === true) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.OK,
          'shop_created_successfully',
          shopData.lg
        )
      );
    }
  } catch (error) {
    console.error('Create shop error:', error);
    return Promise.reject(
      setServerResponse(
        API_STATUS_CODE.INTERNAL_SERVER_ERROR,
        'internal_server_error',
        shopData.lg
      )
    );
  }
};

module.exports = {
  createShop,
};
