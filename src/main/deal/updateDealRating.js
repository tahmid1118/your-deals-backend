const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const checkDealExists = async (dealId) => {
  const _query = `SELECT deal_id FROM deal WHERE deal_id = ?;`;
  
  try {
    const [result] = await pool.query(_query, [dealId]);
    return result.length > 0;
  } catch (error) {
    console.error('Error checking deal exists:', error);
    return Promise.reject(error);
  }
};

const updateDealRatingQuery = async (dealId, rating) => {
  const _query = `
    UPDATE deal
    SET rating = ?, updated_at = NOW()
    WHERE deal_id = ?;
  `;

  try {
    const [result] = await pool.query(_query, [rating, dealId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating deal rating:', error);
    return Promise.reject(error);
  }
};

const updateDealRating = async (dealId, rating, lg) => {
  try {
    const exists = await checkDealExists(dealId);
    if (!exists) {
      return Promise.reject(
        setServerResponse(
          API_STATUS_CODE.NOT_FOUND,
          'deal_not_found',
          lg
        )
      );
    }

    const isUpdated = await updateDealRatingQuery(dealId, rating);
    if (isUpdated) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.OK,
          'deal_rating_updated_successfully',
          lg,
          { rating }
        )
      );
    }
  } catch (error) {
    console.error('Update deal rating error:', error);
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
  updateDealRating,
};
