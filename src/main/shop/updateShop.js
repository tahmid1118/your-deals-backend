const { format } = require("date-fns");
const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const checkShopExists = async (shopId) => {
  const _query = `
        SELECT * 
        FROM 
            shop
        WHERE 
            shop_id = ?;
    `;

  try {
    const [rows] = await pool.query(_query, [shopId]);
    return rows.length > 0 ? true : false;
  } catch (error) {
    console.error('Error checking shop exists:', error);
    return Promise.reject(error);
  }
};

const updateShopDataQuery = async (shopData) => {
  let _query = `UPDATE shop SET `;
  const _values = [];

  if (shopData.shopName) {
    _query += `shop_name = ? `;
    _values.push(shopData.shopName);
  }

  if (shopData.shopDetails !== undefined) {
    if (_values.length > 0) _query += ", ";
    _query += `shop_details = ? `;
    _values.push(shopData.shopDetails);
  }

  if (shopData.shopEmail !== undefined) {
    if (_values.length > 0) _query += ", ";
    _query += `shop_email = ? `;
    _values.push(shopData.shopEmail);
  }

  if (shopData.shopContact !== undefined) {
    if (_values.length > 0) _query += ", ";
    _query += `shop_contact = ? `;
    _values.push(shopData.shopContact);
  }

  if (shopData.shopContactAlternative !== undefined) {
    if (_values.length > 0) _query += ", ";
    _query += `shop_contact_alternative = ? `;
    _values.push(shopData.shopContactAlternative);
  }

  if (_values.length > 0) {
    _query += ", ";
    _query += `updated_at = ? `;
    _values.push(shopData.updatedAt);
  }

  // Final WHERE condition
  _query += ` WHERE shop_id = ?`;
  _values.push(shopData.shopId);

  try {
    const [rows] = await pool.query(_query, _values);
    if (rows.affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating shop data query:', error);
    return Promise.reject(error);
  }
};

const updateShop = async (shopData) => {
  const updatedAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  shopData = { ...shopData, updatedAt: updatedAt };
  const language = shopData.lg || 'en';
  try {
    const isExist = await checkShopExists(shopData.shopId);
    if (isExist === false) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'shop_not_found',
          language
        )
      );
    }
    const isUpdated = await updateShopDataQuery(shopData);
    if (isUpdated) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.OK,
          'shop_updated_successfully',
          language
        )
      );
    }
  } catch (error) {
    console.error('Update shop error:', error);
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
  updateShop,
};
