const express = require("express");
const multer = require("multer");
const dealRouter = express.Router();

const { dealDataValidator } = require("../../middlewares/deal/dealDataValidator");
const { checkShopExists } = require("../../middlewares/common/checkShopExists");
const { checkBranchExists } = require("../../middlewares/common/checkBranchExists");
const { languageValidator } = require("../../middlewares/common/languageValidator");
const { createDeal } = require("../../main/deal/createDeal");
const { authenticateToken } = require("../../middlewares/jwt/jwt");
const { getDealTableData } = require("../../main/deal/getDealTableData");
const { paginationData } = require("../../middlewares/pagination/paginationData");
const { getDealListData } = require("../../main/deal/getDealListData");
const { updateDeal } = require("../../main/deal/updateDeal");
const { deleteDeal } = require("../../main/deal/deleteDeal");

// Multer configuration for thumbnail upload
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (PNG, JPEG, JPG, WEBP) are allowed!"));
    }
  },
  limits: {
    fileSize: 10240000, // 10MB
  },
});

/**
 * @description This route is used to create a new deal.
 * It requires authentication and can include an optional thumbnail image.
 */
dealRouter.post(
  "/create",
  authenticateToken,
  upload.single('deal_thumbnail'),
  checkShopExists,
  checkBranchExists,
  dealDataValidator,
  async (req, res) => {
    const thumbnailBuffer = req.file?.buffer;

    createDeal(req.body.dealData, thumbnailBuffer)
      .then((data) => {
        const { statusCode, status, message } = data;
        return res.status(statusCode).send({
          status: status,
          message: message,
        });
      })
      .catch((error) => {
        console.error("Create deal error:", error);
        const { statusCode, status, message } = error;
        return res.status(statusCode).send({
          status: status,
          message: message,
        });
      });
  }
);

/**
 * @description This route is used to get the deal table data with pagination and filters.
 * Supports filtering by shopId, branchId, categoryTitle, and targetCustomer.
 * All filters are optional and can be combined.
 * It requires authentication.
 */
dealRouter.post(
  "/table-data",
  authenticateToken,
  paginationData,
  async (req, res) => {
    const { paginationData, filter = {} } = req.body;

    // Prepare filter object
    const filters = {
      shopId: filter.shopId ? parseInt(filter.shopId) : null,
      branchId: filter.branchId ? parseInt(filter.branchId) : null,
      categoryTitle: filter.categoryTitle || null,
      targetCustomer: filter.targetCustomer || null,
    };

    // Validate: if branchId is provided, shopId must also be provided
    if (filters.branchId && !filters.shopId) {
      const { setServerResponse } = require("../../common/setServerResponse");
      const { API_STATUS_CODE } = require("../../consts/errorStatus");
      return res.status(API_STATUS_CODE.BAD_REQUEST).send(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'shop_id_is_required',
          paginationData.lg
        )
      );
    }

    getDealTableData(paginationData, filters)
      .then((data) => {
        const { statusCode, status, message, result } = data;
        return res.status(statusCode).send({
          status: status,
          message: message,
          data: result,
        });
      })
      .catch((error) => {
        const { statusCode, status, message } = error;
        return res.status(statusCode).send({
          status: status,
          message: message,
        });
      });
  }
);

/**
 * @description This route is used to return deal list.
 * It requires authentication.
 */
dealRouter.post("/deal-list", authenticateToken, languageValidator, async (req, res) => {
  const { lg } = req.body;
  getDealListData(lg)
    .then((data) => {
      const { statusCode, status, message, result } = data;
      return res.status(statusCode).send({
        status: status,
        message: message,
        data: result,
      });
    })
    .catch((error) => {
      const { statusCode, status, message } = error;
      return res.status(statusCode).send({
        status: status,
        message: message,
      });
    });
});

/**
 * @description This route is used to update an existing deal.
 * It requires authentication and can include an optional thumbnail image.
 */
dealRouter.post(
  "/update",
  authenticateToken,
  upload.single('deal_thumbnail'),
  checkShopExists,
  checkBranchExists,
  dealDataValidator,
  async (req, res) => {
    const thumbnailBuffer = req.file?.buffer;

    updateDeal(req.body.dealData, thumbnailBuffer)
      .then((data) => {
        const { statusCode, status, message, result } = data;
        return res.status(statusCode).send({
          status: status,
          message: message,
          data: result,
        });
      })
      .catch((error) => {
        console.error("Update deal error:", error);
        const { statusCode, status, message } = error;
        return res.status(statusCode).send({
          status: status,
          message: message,
        });
      });
  }
);

/**
 * @description This route is used to delete a deal.
 * It requires authentication.
 */
dealRouter.delete("/delete", authenticateToken, languageValidator, async (req, res) => {
  const { dealId, lg } = req.body;

  if (!dealId) {
    return res.status(400).send({
      status: "failed",
      message: "Deal ID is required",
    });
  }

  deleteDeal(dealId, lg)
    .then((data) => {
      const { statusCode, status, message } = data;
      return res.status(statusCode).send({
        status: status,
        message: message,
      });
    })
    .catch((error) => {
      console.error("Delete deal error:", error);
      const { statusCode, status, message } = error;
      return res.status(statusCode).send({
        status: status,
        message: message,
      });
    });
});

module.exports = {
  dealRouter,
};
