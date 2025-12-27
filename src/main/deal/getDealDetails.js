const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

/**
 * Fetch deal details by deal id, including shop, branch, and categories
 * @param {number|string} dealId
 * @param {string} [lg] - language code (optional)
 * @returns {Promise<object>} Deal details or error response
 */
const getDealDetails = async (dealId, lg) => {
  if (!dealId) {
    return setServerResponse(
      API_STATUS_CODE.BAD_REQUEST,
      "deal_id_required",
      lg
    );
  }

  // Query for deal, shop, branch
  const dealQuery = `
    SELECT d.*, s.shop_name, s.shop_details, b.branch_name, b.branch_location, b.branch_address, b.branch_area
    FROM deal d
    LEFT JOIN shop s ON d.shop_id = s.shop_id
    LEFT JOIN branch b ON d.branch_id = b.branch_id
    WHERE d.deal_id = ?
    LIMIT 1;
  `;

  // Query for categories
  const categoryQuery = `
    SELECT c.category_id, c.category_title, c.category_description, c.target_customer
    FROM deal_category dc
    JOIN category c ON dc.category_id = c.category_id
    WHERE dc.deal_id = ?;
  `;

  try {
    const [dealRows] = await pool.query(dealQuery, [dealId]);
    if (dealRows.length === 0) {
      return setServerResponse(
        API_STATUS_CODE.NOT_FOUND,
        "deal_not_found",
        lg
      );
    }
    const deal = dealRows[0];
    const [categoryRows] = await pool.query(categoryQuery, [dealId]);
    deal.categories = categoryRows;
    return setServerResponse(
      API_STATUS_CODE.OK,
      "deal_details_fetched_successfully",
      lg,
      deal
    );
  } catch (error) {
    console.error("Error fetching deal details:", error);
    return setServerResponse(
      API_STATUS_CODE.INTERNAL_SERVER_ERROR,
      "internal_server_error",
      lg
    );
  }
};

module.exports = {
  getDealDetails,
};
