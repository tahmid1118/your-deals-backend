const fs = require('fs');
const path = require('path');
const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const deleteDealDataQuery = async (dealId) => {
  const _query = `SELECT deal_thumbnail FROM deal WHERE deal_id = ?;`;
  
  try {
    const [result] = await pool.query(_query, [dealId]);
    if (result.length === 0) {
      return false;
    }

    const thumbnailPath = result[0].deal_thumbnail;

    // Delete from database
    const deleteQuery = `DELETE FROM deal WHERE deal_id = ?;`;
    const [deleteResult] = await pool.query(deleteQuery, [dealId]);

    // Delete thumbnail file if exists
    if (thumbnailPath) {
      try {
        const absolutePath = path.join(process.cwd(), thumbnailPath);
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }
      } catch (error) {
        console.error('Error deleting thumbnail file:', error);
      }
    }

    return deleteResult.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting deal:', error);
    return Promise.reject(error);
  }
};

const deleteDeal = async (dealId, lg) => {
  try {
    const isDeleted = await deleteDealDataQuery(dealId);
    if (isDeleted) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.OK,
          'deal_deleted_successfully',
          lg
        )
      );
    } else {
      return Promise.reject(
        setServerResponse(
          API_STATUS_CODE.NOT_FOUND,
          'deal_not_found',
          lg
        )
      );
    }
  } catch (error) {
    console.error('Delete deal error:', error);
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
  deleteDeal,
};
