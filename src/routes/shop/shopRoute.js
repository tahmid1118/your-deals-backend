const express = require("express");
const shopRouter = express.Router();

const {
  shopDataValidator,
} = require("../../middlewares/shop/shopDataValidator");
const { languageValidator } = require("../../middlewares/common/languageValidator");
const { createShop } = require("../../main/shop/createShop");
const { authenticateToken } = require("../../middlewares/jwt/jwt");
const { getShopTableData } = require("../../main/shop/getShopTableData");
const {
  paginationData,
} = require("../../middlewares/pagination/paginationData");
const { getShopListData } = require("../../main/shop/getShopListData");
const { updateShop } = require("../../main/shop/updateShop");
const { deleteShop } = require("../../main/shop/deleteShop");

/**
 * @description This route is used to create a new shop.
 * It requires authentication.
 */
shopRouter.post("/create", authenticateToken, shopDataValidator, async (req, res) => {
  createShop(req.body.shopData)
    .then((data) => {
      const { statusCode, status, message } = data;
      return res.status(statusCode).send({
        status: status,
        message: message,
      });
    })
    .catch((error) => {
      console.error("Create shop error:", error);
      const { statusCode, status, message } = error;
      return res.status(statusCode).send({
        status: status,
        message: message,
      });
    });
});

/**
 * @description This route is used to get the shop table data.
 * It requires authentication.
 */
shopRouter.post(
  "/table-data",
  authenticateToken,
  paginationData,
  async (req, res) => {
    const { paginationData } = req.body;

    getShopTableData(paginationData)
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
 * @description This route is used to return shop list.
 * It requires authentication.
 */
shopRouter.post("/shop-list", authenticateToken, languageValidator, async (req, res) => {
  const { lg } = req.body;
  getShopListData(lg)
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
 * @description This route is used to update shop data.
 * It requires authentication.
 */
shopRouter.post(
  "/update",
  authenticateToken,
  shopDataValidator,
  async (req, res) => {
    updateShop(req.body.shopData)
      .then((data) => {
        const { statusCode, status, message } = data;
        return res.status(statusCode).send({
          status: status,
          message: message,
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
 * @description This route is used to delete a shop.
 * It requires authentication.
 */
shopRouter.post("/delete", authenticateToken, languageValidator, async (req, res) => {
  const { shopId, lg } = req.body;
  
  if (!shopId) {
    return res.status(400).send({
      status: 'error',
      message: 'shop_id_is_required',
    });
  }

  deleteShop(shopId, lg)
    .then((data) => {
      const { statusCode, status, message } = data;
      return res.status(statusCode).send({
        status: status,
        message: message,
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

module.exports = {
  shopRouter,
};
