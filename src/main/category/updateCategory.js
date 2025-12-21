const { format } = require("date-fns");
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

const updateCategoryDataQuery = async (categoryData) => {
  let _query = `UPDATE category SET `;
  const _values = [];

  if (categoryData.categoryTitle) {
    _query += `category_title = ? `;
    _values.push(categoryData.categoryTitle);
  }

  if (categoryData.categoryDescription !== undefined) {
    if (_values.length > 0) _query += ", ";
    _query += `category_description = ? `;
    _values.push(categoryData.categoryDescription);
  }

  if (categoryData.targetCustomer) {
    if (_values.length > 0) _query += ", ";
    _query += `target_customer = ? `;
    _values.push(categoryData.targetCustomer);
  }

  if (_values.length > 0) {
    _query += ", ";
    _query += `updated_at = ? `;
    _values.push(categoryData.updatedAt);
  }

  // Final WHERE condition
  _query += ` WHERE category_id = ?`;
  _values.push(categoryData.categoryId);

  try {
    const [rows] = await pool.query(_query, _values);
    if (rows.affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating category data query:', error);
    return Promise.reject(error);
  }
};

const updateCategory = async (categoryData) => {
  const updatedAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  categoryData = { ...categoryData, updatedAt: updatedAt };
  const language = categoryData.lg || 'en';
  try {
    const isExist = await checkCategoryExists(categoryData.categoryId);
    if (isExist === false) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'category_not_found',
          language
        )
      );
    }
    const isUpdated = await updateCategoryDataQuery(categoryData);
    if (isUpdated) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.OK,
          'category_updated_successfully',
          language
        )
      );
    }
  } catch (error) {
    console.error('Update category error:', error);
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
  updateCategory,
};
