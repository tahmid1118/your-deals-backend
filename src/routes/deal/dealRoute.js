
// ================= IMPORTS =================
const express = require("express");
const multer = require("multer");
const dealRouter = express.Router();
  const db = require("../../../database/dbPool");
const { dealDataValidator } = require("../../middlewares/deal/dealDataValidator");
const { checkShopExists } = require("../../middlewares/common/checkShopExists");
const { checkBranchExists } = require("../../middlewares/common/checkBranchExists");
const { languageValidator } = require("../../middlewares/common/languageValidator");
const { createDeal } = require("../../main/deal/createDeal");
const { authenticateToken } = require("../../middlewares/jwt/jwt");
const { getDealDetails } = require("../../main/deal/getDealDetails");
const { getDealTableData } = require("../../main/deal/getDealTableData");
const { paginationData } = require("../../middlewares/pagination/paginationData");
const { getDealListData } = require("../../main/deal/getDealListData");
const { updateDeal } = require("../../main/deal/updateDeal");
const { deleteDeal } = require("../../main/deal/deleteDeal");

// ================= ROUTES & LOGIC =================

/**
 * @description This route takes an array of categoryIds and returns 5 random deals (from the top 10 by rating) that match any of those categories.
 * It requires authentication.
 */
const { getRandomTopDeals } = require("../../main/deal/getRandomTopDeals");
dealRouter.post("/random-top-deals", async (req, res) => {
  const { categoryIds, lg, dealId } = req.body;
  if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
    return res.status(400).send({
      status: "failed",
      message: "categoryIds (array) is required",
    });
  }

  getRandomTopDeals(categoryIds, lg, dealId)
    .then((data) => {
      const { statusCode = 200, status, message, result } = data;
      return res.status(statusCode).send({
        status: status,
        message: message,
        data: result,
      });
    })
    .catch((error) => {
      console.error("Random top deals error:", error);
      const { statusCode = 500, status = "failed", message = "Internal server error" } = error || {};
      return res.status(statusCode).send({
        status: status,
        message: message,
      });
    });
});
/**
 * @description This route is used to fetch deal details by deal id.
 * It requires authentication.
 */
dealRouter.post("/details", languageValidator, async (req, res) => {
  const { dealId, lg } = req.body;
  if (!dealId) {
    return res.status(400).send({
      status: "failed",
      message: "Deal ID is required",
    });
  }
  getDealDetails(dealId, lg)
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

// Multer configuration for thumbnail upload
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Only validate if the field name matches
    if (file.fieldname !== 'dealThumbnail') {
      cb(new Error(`Unexpected field: ${file.fieldname}. Expected 'dealThumbnail'`));
      return;
    }
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
  upload.single('dealThumbnail'),
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
  (req, res, next) => {
    // Use multer with error handling for optional file upload
    upload.single('dealThumbnail')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'UNEXPECTED_FIELD') {
          return res.status(400).send({
            status: "failed",
            message: `Unexpected field: ${err.field}. Expected field name is 'dealThumbnail'`,
          });
        }
        return res.status(400).send({
          status: "failed",
          message: err.message,
        });
      } else if (err) {
        return res.status(400).send({
          status: "failed",
          message: err.message,
        });
      }
      next();
    });
  },
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
