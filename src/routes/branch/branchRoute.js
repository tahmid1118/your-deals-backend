const express = require("express");
const branchRouter = express.Router();

const {
  branchDataValidator,
} = require("../../middlewares/branch/branchDataValidator");
const { createBranch } = require("../../main/branch/createBranch");
const { authenticateToken } = require("../../middlewares/jwt/jwt");
const { getBranchTableData } = require("../../main/branch/getBranchTableData");
const {
  paginationData,
} = require("../../middlewares/pagination/paginationData");
const { getBranchListData } = require("../../main/branch/getBranchListData");
const { updateBranch } = require("../../main/branch/updateBranch");
const { deleteBranch } = require("../../main/branch/deleteBranch");

/**
 * @description This route is used to create a new branch.
 * It requires authentication.
 */
branchRouter.post("/create", authenticateToken, branchDataValidator, async (req, res) => {
  createBranch(req.body.branchData)
    .then((data) => {
      const { statusCode, status, message } = data;
      return res.status(statusCode).send({
        status: status,
        message: message,
      });
    })
    .catch((error) => {
      console.error("Create branch error:", error);
      const { statusCode, status, message } = error;
      return res.status(statusCode).send({
        status: status,
        message: message,
      });
    });
});

/**
 * @description This route is used to get the branch table data.
 * It requires authentication.
 */
branchRouter.post(
  "/table-data",
  authenticateToken,
  paginationData,
  async (req, res) => {
    const { paginationData, shopId } = req.body;

    getBranchTableData(paginationData, shopId)
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
 * @description This route is used to return branch list.
 * It requires authentication.
 */
branchRouter.post("/branch-list", authenticateToken, async (req, res) => {
  const { shopId, lg } = req.body;
  getBranchListData(shopId, lg)
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
 * @description This route is used to update branch data.
 * It requires authentication.
 */
branchRouter.post(
  "/update",
  authenticateToken,
  branchDataValidator,
  async (req, res) => {
    updateBranch(req.body.branchData)
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
 * @description This route is used to delete a branch.
 * It requires authentication.
 */
branchRouter.post("/delete", authenticateToken, async (req, res) => {
  const { branchId, lg } = req.body;
  
  if (!branchId) {
    return res.status(400).send({
      status: 'error',
      message: 'branch_id_is_required',
    });
  }

  deleteBranch(branchId, lg)
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
  branchRouter,
};
