const { pool } = require("../../../database/dbPool");
const { getDealDetails } = require("./getDealDetails");
const { setServerResponse } = require("../../common/setServerResponse");
const { API_STATUS_CODE } = require("../../consts/errorStatus");


/**
 * Fetches 5 random deals (from the top 10 by rating) that match any of the given categoryIds, excluding a specific dealId.
 * If not enough deals, fills with deals from other categories.
 * @param {number[]} categoryIds
 * @param {string} lg
 * @param {number} [excludeDealId]
 * @returns {Promise<{statusCode:number,status:string,message:string,result:any[]}>}
 */
async function getRandomTopDeals(categoryIds, lg, excludeDealId) {
  try {
    // 1. Get top 10 deals for the given categories, excluding the dealId if provided
    let query = `SELECT d.deal_id, d.deal_title, d.deal_details, d.deal_thumbnail, d.rating
       FROM deal_category dc
       JOIN deal d ON dc.deal_id = d.deal_id
       WHERE dc.category_id IN (?)`;
    const params = [categoryIds];
    if (excludeDealId) {
      query += ' AND d.deal_id != ?';
      params.push(excludeDealId);
    }
    query += ` ORDER BY d.rating DESC, d.deal_id DESC LIMIT 10`;
    const [deals] = await pool.query(query, params);

    // 2. Shuffle and pick up to 5
    let shuffled = deals.sort(() => 0.5 - Math.random());
    let selectedDeals = shuffled.slice(0, 5);

    // 3. If less than 5, fill with other deals (not in selectedDeals, not excludeDealId)
    if (selectedDeals.length < 5) {
      // Get more deals from other categories, excluding already selected and excludeDealId
      const excludeIds = selectedDeals.map(d => d.deal_id);
      if (excludeDealId) excludeIds.push(excludeDealId);
      const placeholders = excludeIds.length ? `AND d.deal_id NOT IN (${excludeIds.map(() => '?').join(',')})` : '';
      const [otherDeals] = await pool.query(
        `SELECT d.deal_id, d.deal_title, d.deal_details, d.deal_thumbnail, d.rating
         FROM deal d
         WHERE 1=1 ${placeholders}
         ORDER BY d.rating DESC, d.deal_id DESC
         LIMIT ?`,
        [...excludeIds, 10]
      );
      // Add up to fill 5
      for (const d of otherDeals) {
        if (selectedDeals.length < 5) selectedDeals.push(d);
        else break;
      }
    }

    // 4. Fetch full details for each deal
    const detailsPromises = selectedDeals.map((deal) => getDealDetails(deal.deal_id, lg));
    const detailsResults = await Promise.all(detailsPromises);
    const responseDeals = detailsResults.map((d) => d.result);

    return setServerResponse(
      API_STATUS_CODE.OK,
      'random_top_deals_fetched_successfully',
      lg,
      responseDeals
    );
  } catch (error) {
    console.error("getRandomTopDeals error:", error);
    return setServerResponse(
      API_STATUS_CODE.INTERNAL_SERVER_ERROR,
      'internal_server_error',
      lg,
      []
    );
  }
}

module.exports = {
  getRandomTopDeals,
};
