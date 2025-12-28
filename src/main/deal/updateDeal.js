const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const checkDealExists = async (dealId) => {
  const _query = `SELECT deal_id, deal_thumbnail FROM deal WHERE deal_id = ?;`;
  
  try {
    const [result] = await pool.query(_query, [dealId]);
    if (result.length > 0) {
      return result[0];
    }
    return false;
  } catch (error) {
    console.error('Error checking deal exists:', error);
    return Promise.reject(error);
  }
};

const processThumbnail = async (buffer) => {
  if (!buffer) return null;

  try {
    const fileName = `deal-${Date.now()}.jpeg`;
    const relativePath = `uploads/deal-thumbnails/${fileName}`;
    const absolutePath = path.join(process.cwd(), relativePath);

    // Ensure directory exists
    const dir = path.dirname(absolutePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const resizedImage = await sharp(buffer)
      .resize(800, 600)
      .jpeg({ mozjpeg: true })
      .toBuffer();

    fs.writeFileSync(absolutePath, resizedImage);
    return fileName; // Return only the filename, not the full path
  } catch (error) {
    console.error('Error processing thumbnail:', error);
    return Promise.reject(error);
  }
};

const deleteThumbnail = (thumbnailFileName) => {
  if (!thumbnailFileName) return;
  
  try {
    const absolutePath = path.join(process.cwd(), 'uploads/deal-thumbnails', thumbnailFileName);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (error) {
    console.error('Error deleting thumbnail:', error);
  }
};

const updateDealDataQuery = async (dealData, thumbnailPath) => {
  let updateFields = [];
  let values = [];

  if (dealData.dealTitle !== undefined) {
    updateFields.push('deal_title = ?');
    values.push(dealData.dealTitle);
  }
  if (dealData.dealDetails !== undefined) {
    updateFields.push('deal_details = ?');
    values.push(dealData.dealDetails || null);
  }
  if (thumbnailPath !== undefined) {
    updateFields.push('deal_thumbnail = ?');
    values.push(thumbnailPath);
  }
  if (dealData.sourceFacebook !== undefined) {
    updateFields.push('source_facebook = ?');
    values.push(dealData.sourceFacebook || null);
  }
  if (dealData.sourceWebsite !== undefined) {
    updateFields.push('source_website = ?');
    values.push(dealData.sourceWebsite || null);
  }
  if (dealData.sourceInstagram !== undefined) {
    updateFields.push('source_instagram = ?');
    values.push(dealData.sourceInstagram || null);
  }
  if (dealData.dealChannel !== undefined) {
    updateFields.push('deal_channel = ?');
    values.push(dealData.dealChannel);
  }
  if (dealData.dealType !== undefined) {
    updateFields.push('deal_type = ?');
    values.push(dealData.dealType || null);
  }
  if (dealData.dealStartDatetime !== undefined) {
    updateFields.push('deal_start_datetime = ?');
    values.push(dealData.dealStartDatetime || null);
  }
  if (dealData.dealEndDatetime !== undefined) {
    updateFields.push('deal_end_datetime = ?');
    values.push(dealData.dealEndDatetime || null);
  }
  if (dealData.rating !== undefined) {
    updateFields.push('rating = ?');
    values.push(dealData.rating || null);
  }
  if (dealData.branchId !== undefined) {
    updateFields.push('branch_id = ?');
    values.push(dealData.branchId || null);
  }
  if (dealData.shopId !== undefined) {
    updateFields.push('shop_id = ?');
    values.push(dealData.shopId);
  }

  updateFields.push('updated_at = NOW()');
  values.push(dealData.dealId);

  const _query = `
    UPDATE deal
    SET ${updateFields.join(', ')}
    WHERE deal_id = ?;
  `;

  try {
    const [result] = await pool.query(_query, values);
    if (result.affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating deal data:', error);
    return Promise.reject(error);
  }
};

const updateDeal = async (dealData, thumbnailBuffer) => {
  try {
    const existingDeal = await checkDealExists(dealData.dealId);
    if (!existingDeal) {
      return Promise.reject(
        setServerResponse(
          API_STATUS_CODE.NOT_FOUND,
          'deal_not_found',
          dealData.lg
        )
      );
    }

    let thumbnailPath = undefined;
    if (thumbnailBuffer) {
      // Delete old thumbnail if exists
      if (existingDeal.deal_thumbnail) {
        deleteThumbnail(existingDeal.deal_thumbnail);
      }
      thumbnailPath = await processThumbnail(thumbnailBuffer);
    }

    const isUpdated = await updateDealDataQuery(dealData, thumbnailPath);
    if (isUpdated) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.OK,
          'deal_updated_successfully',
          dealData.lg,
          thumbnailPath ? { thumbnailPath } : null
        )
      );
    }
  } catch (error) {
    console.error('Update deal error:', error);
    return Promise.reject(
      setServerResponse(
        API_STATUS_CODE.INTERNAL_SERVER_ERROR,
        'internal_server_error',
        dealData.lg
      )
    );
  }
};

module.exports = {
  updateDeal,
};
