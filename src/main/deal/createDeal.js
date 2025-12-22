const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { pool } = require("../../../database/dbPool");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const insertDealDataQuery = async (dealData, thumbnailPath) => {
  const _query = `
    INSERT INTO deal (
        deal_title,
        deal_details,
        deal_thumbnail,
        source_facebook,
        source_website,
        source_instagram,
        deal_channel,
        deal_type,
        deal_start_datetime,
        deal_end_datetime,
        branch_id,
        shop_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

  const _values = [
    dealData.dealTitle,
    dealData.dealDetails || null,
    thumbnailPath || null,
    dealData.sourceFacebook || null,
    dealData.sourceWebsite || null,
    dealData.sourceInstagram || null,
    dealData.dealChannel,
    dealData.dealType || null,
    dealData.dealStartDatetime || null,
    dealData.dealEndDatetime || null,
    dealData.branchId || null,
    dealData.shopId,
  ];

  try {
    const [rows] = await pool.query(_query, _values);
    if (rows.affectedRows > 0) {
      return rows.insertId;
    }
    return false;
  } catch (error) {
    console.error('Error inserting deal data:', error);
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
    return relativePath;
  } catch (error) {
    console.error('Error processing thumbnail:', error);
    return Promise.reject(error);
  }
};

const createDeal = async (dealData, thumbnailBuffer) => {
  try {
    let thumbnailPath = null;
    if (thumbnailBuffer) {
      thumbnailPath = await processThumbnail(thumbnailBuffer);
    }

    const dealId = await insertDealDataQuery(dealData, thumbnailPath);
    if (dealId) {
      return Promise.resolve(
        setServerResponse(
          API_STATUS_CODE.OK,
          'deal_created_successfully',
          dealData.lg,
          { dealId, thumbnailPath }
        )
      );
    }
  } catch (error) {
    console.error('Create deal error:', error);
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
  createDeal,
};
