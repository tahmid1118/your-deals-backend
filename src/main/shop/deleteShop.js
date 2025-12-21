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

const deleteShopQuery = async (shopId) => {
  const _query = `
        DELETE FROM 
            shop 
        WHERE 
            shop_id = ?;
    `;

  try {
    const [rows] = await pool.query(_query, [shopId]);
    if (rows.affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting shop query:', error);
    return Promise.reject(error);
  }
};

const deleteShop = async (shopId, lg = 'en') => {
  try {
    const isExist = await checkShopExists(shopId);
    if (isExist === false) {
      return Promise.reject(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'shop_not_found',
          lg
        )
      );
    }

    const isDeleted = await deleteShopQuery(shopId);
    if (isDeleted) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.OK,
          'shop_deleted_successfully',
          lg
        )
      );
    }
  } catch (error) {
    console.error('Delete shop error:', error);
    return Promise.reject(
      setServerResponse(
        API_STATUS_CODE.INTERNAL_SERVER_ERROR,
        'internal_server_error',
        lg
      )
    );
  }
};

module.exports = {
  deleteShop,
};
