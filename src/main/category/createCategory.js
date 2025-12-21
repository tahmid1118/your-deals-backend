const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const checkDuplicateCategoryTitle = async (categoryTitle) => {
  const _query = `
    SELECT 
        category_title
    FROM
        category
    WHERE
        category_title = ?;
`;

  try {
    const [result] = await pool.query(_query, categoryTitle);
    if (result.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking duplicate category title:', error);
    return Promise.reject(error);
  }
};

const insertCategoryDataQuery = async (categoryData) => {
  const _query = `
    INSERT INTO category (
        category_title,
        category_description,
        target_customer
    )
    VALUES (?, ?, ?);
`;

  const _values = [
    categoryData.categoryTitle,
    categoryData.categoryDescription || null,
    categoryData.targetCustomer,
  ];

  try {
    const [rows] = await pool.query(_query, _values);
    if (rows.affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error inserting category data:', error);
    return Promise.reject(error);
  }
};

const createCategory = async (categoryData) => {
  try {
    const isDuplicateCategoryTitle = await checkDuplicateCategoryTitle(categoryData.categoryTitle);
    if (isDuplicateCategoryTitle) {
      return Promise.reject(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'category_title_already_exists',
          categoryData.lg
        )
      );
    }

    const insertedData = await insertCategoryDataQuery(categoryData);
    if (insertedData === true) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.OK,
          'category_created_successfully',
          categoryData.lg
        )
      );
    }
  } catch (error) {
    console.error('Create category error:', error);
    return Promise.reject(
      setServerResponse(
        API_STATUS_CODE.INTERNAL_SERVER_ERROR,
        'internal_server_error',
        categoryData.lg
      )
    );
  }
};

module.exports = {
  createCategory,
};
