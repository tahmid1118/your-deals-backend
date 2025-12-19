const { setServerResponse } = require("../../common/setServerResponse");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { pool } = require("../../../database/dbPool");

const totalUserTableRowCount = async () => {
  const _query = `
        SELECT 
            COUNT(*) AS totalRows
        FROM 
            user;
    `;

  try {
    const [rows] = await pool.query(_query);
    if (rows.length > 0) {
      return Promise.resolve(rows[0].totalRows);
    }
    return Promise.resolve(0);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getUserTableDataQuery = async (paginationData) => {
  const _query = `
        SELECT
            id,
           full_name,
            email,
            is_user_active,
            profile_img,
            created_at,
            updated_at
        FROM
            user
        ORDER BY
            created_at DESC
        LIMIT ? OFFSET ?;
    `;
  const _values = [paginationData.itemsPerPage, paginationData.offset];

  try {
    const [rows] = await pool.query(_query, _values);
    return Promise.resolve(rows);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getUserTableData = async (paginationData) => {
  try {
    const totalRows = await totalUserTableRowCount();
    const userData = await getUserTableDataQuery(paginationData);

    const result = {
      metadata: {
        totalRows: totalRows,
      },
      tableData: userData,
    };
    return Promise.resolve(
      setServerResponse(
        API_STATUS_CODE.OK,
        "User data fetched successfully",
        result
      )
    );
  } catch (error) {
    return Promise.reject(
      setServerResponse(
        API_STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Internal server error"
      )
    );
  }
};

module.exports = {
  getUserTableData,
};
