const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const checkCategoryExists = async (categoryId) => {
  const _query = `
        SELECT * 
        FROM 
            category
        WHERE 
            category_id = ?;
    `;

  try {
    const [rows] = await pool.query(_query, [categoryId]);
    return rows.length > 0 ? true : false;
  } catch (error) {
    console.error('Error checking category exists:', error);
    return Promise.reject(error);
  }
};

const deleteCategoryQuery = async (categoryId) => {
  const _query = `
        DELETE FROM 
            category 
        WHERE 
            category_id = ?;
    `;

  try {
    const [rows] = await pool.query(_query, [categoryId]);
    if (rows.affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting category query:', error);
    return Promise.reject(error);
  }
};

const deleteCategory = async (categoryId, lg = 'en') => {
  try {
    const isExist = await checkCategoryExists(categoryId);
    if (isExist === false) {
      return Promise.reject(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'category_not_found',
          lg
        )
      );
    }

    const isDeleted = await deleteCategoryQuery(categoryId);
    if (isDeleted) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.OK,
          'category_deleted_successfully',
          lg
        )
      );
    }
  } catch (error) {
    console.error('Delete category error:', error);
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
  deleteCategory,
};
