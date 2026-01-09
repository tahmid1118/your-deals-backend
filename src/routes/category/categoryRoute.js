const express = require("express");
const categoryRouter = express.Router();

const {
  categoryDataValidator,
} = require("../../middlewares/category/categoryDataValidator");
const { languageValidator } = require("../../middlewares/common/languageValidator");
const { createCategory } = require("../../main/category/createCategory");
const { authenticateToken } = require("../../middlewares/jwt/jwt");
const { getCategoryTableData } = require("../../main/category/getCategoryTableData");
const {
  paginationData,
} = require("../../middlewares/pagination/paginationData");
const { getCategoryListData } = require("../../main/category/getCategoryListData");
const { updateCategory } = require("../../main/category/updateCategory");
const { deleteCategory } = require("../../main/category/deleteCategory");

/**
 * @description This route is used to create a new category.
 * It requires authentication.
 */
categoryRouter.post("/create", authenticateToken, categoryDataValidator, async (req, res) => {
  createCategory(req.body.categoryData)
    .then((data) => {
      const { statusCode, status, message } = data;
      return res.status(statusCode).send({
        status: status,
        message: message,
      });
    })
    .catch((error) => {
      console.error("Create category error:", error);
      const { statusCode, status, message } = error;
      return res.status(statusCode).send({
        status: status,
        message: message,
      });
    });
});

/**
 * @description This route is used to get the category table data.
 * It requires authentication.
 */
categoryRouter.post(
  "/table-data",
  authenticateToken,
  paginationData,
  async (req, res) => {
    const { paginationData } = req.body;

    getCategoryTableData(paginationData)
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
 * @description This route is used to return category list.
 * It requires authentication.
 */
categoryRouter.post("/category-list", languageValidator, async (req, res) => {
  const { lg } = req.body;
  getCategoryListData(lg)
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
 * @description This route is used to update category data.
 * It requires authentication.
 */
categoryRouter.post(
  "/update",
  authenticateToken,
  categoryDataValidator,
  async (req, res) => {
    updateCategory(req.body.categoryData)
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
 * @description This route is used to delete a category.
 * It requires authentication.
 */
categoryRouter.post("/delete", authenticateToken, languageValidator, async (req, res) => {
  const { categoryId, lg } = req.body;
  
  if (!categoryId) {
    return res.status(400).send({
      status: 'error',
      message: 'category_id_is_required',
    });
  }

  deleteCategory(categoryId, lg)
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
  categoryRouter,
};
