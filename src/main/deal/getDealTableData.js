const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const getDealTableData = async (paginationData, filters = {}) => {
  const { itemsPerPage, currentPageNumber, offset, filterBy, lg } = paginationData;
  const { shopId, branchId, categoryTitle, targetCustomer } = filters;

  // Build dynamic query with filter conditions
  let baseQuery = `
    FROM
        deal d
    LEFT JOIN shop s ON d.shop_id = s.shop_id
    LEFT JOIN branch b ON d.branch_id = b.branch_id
  `;

  // Add joins for category-based filtering if needed
  if (categoryTitle || targetCustomer) {
    baseQuery += `
    LEFT JOIN deal_category dc ON d.deal_id = dc.deal_id
    LEFT JOIN category c ON dc.category_id = c.category_id
    `;
  }

  // Build WHERE clause with all conditions
  const conditions = [];
  const queryParams = [];
  const countParams = [];

  // Add filter conditions (only if values are truthy and not null)
  if (shopId && shopId !== null) {
    conditions.push('d.shop_id = ?');
    queryParams.push(shopId);
    countParams.push(shopId);
  }

  if (branchId && branchId !== null) {
    conditions.push('d.branch_id = ?');
    queryParams.push(branchId);
    countParams.push(branchId);
  }

  if (categoryTitle && categoryTitle !== null) {
    conditions.push('c.category_title = ?');
    queryParams.push(categoryTitle);
    countParams.push(categoryTitle);
  }

  if (targetCustomer && targetCustomer !== null) {
    conditions.push('c.target_customer = ?');
    queryParams.push(targetCustomer);
    countParams.push(targetCustomer);
  }

  // Add search condition (only if filterBy has a meaningful value)
  if (filterBy && filterBy.trim() !== '' && filterBy !== 'optional search term') {
    conditions.push('(d.deal_title LIKE ? OR s.shop_name LIKE ? OR d.deal_type LIKE ?)');
    const searchValue = `%${filterBy}%`;
    queryParams.push(searchValue, searchValue, searchValue);
    countParams.push(searchValue, searchValue, searchValue);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const _query = `
    SELECT ${categoryTitle || targetCustomer ? 'DISTINCT' : ''}
        d.deal_id,
        d.deal_title,
        d.deal_details,
        d.deal_thumbnail,
        d.source_facebook,
        d.source_website,
        d.source_instagram,
        d.deal_channel,
        d.deal_type,
        d.deal_start_datetime,
        d.deal_end_datetime,
        d.rating,
        d.created_at,
        d.updated_at,
        d.branch_id,
        d.shop_id,
        s.shop_name,
        b.branch_name
    ${baseQuery}
    ${whereClause}
    ORDER BY d.rating DESC, d.created_at DESC
    LIMIT ? OFFSET ?;
  `;

  const countQuery = `
    SELECT COUNT(${categoryTitle || targetCustomer ? 'DISTINCT d.deal_id' : '*'}) as total
    ${baseQuery}
    ${whereClause};
  `;

  // Add pagination params
  queryParams.push(itemsPerPage, offset);

  try {
    const [rows] = await pool.query(_query, queryParams);
    const [countResult] = await pool.query(countQuery, countParams);
    const totalData = countResult[0].total;

    return Promise.resolve(
      setServerResponse(
        API_STATUS_CODE.OK,
        'deal_data_fetched_successfully',
        lg,
        {
          deals: rows,
          pagination: {
            currentPage: currentPageNumber + 1,
            itemsPerPage: itemsPerPage,
            totalData,
            totalPages: Math.ceil(totalData / itemsPerPage)
          }
        }
      )
    );
  } catch (error) {
    console.error('Error fetching deal table data:', error);
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
  getDealTableData,
};
