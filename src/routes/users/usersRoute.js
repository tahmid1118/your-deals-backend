const express = require("express");
const userRouter = express.Router();

const {
  userLoginDataValidator,
} = require("../../middlewares/users/userLoginDataValidator");
const { userLogin } = require("../../main/users/userLogin");
const {
  userDataValidator,
} = require("../../middlewares/users/userRegisterDataValidator");
const { registerNewUser } = require("../../main/users/registerNewUser");
const { authenticateToken } = require("../../middlewares/jwt/jwt");
const { getPersonalData } = require("../../main/users/gerUserPersonalData");
const { getUserTableData } = require("../../main/users/getUserTableData");
const {
  paginationData,
} = require("../../middlewares/pagination/paginationData");
const { getUserListData } = require("../../main/users/getUserListData");
const { updatePersonalInfo } = require("../../main/users/updateUserData");
const { changeUserPassword } = require("../../main/users/changeUserPassword");

userRouter.post("/login", userLoginDataValidator, async (req, res) => {
  userLogin(req.body.userData)
    .then((data) => {
      const { statusCode, status, message, result } = data;
      return res.status(statusCode).send({
        status: status,
        message: message,
        user: result,
      });
    })
    .catch((error) => {
      console.error("Login error:", error);
      const { statusCode, status, message } = error;
      return res.status(statusCode).send({
        status: status,
        message: message,
      });
    });
});

userRouter.post("/register", userDataValidator, async (req, res) => {
  registerNewUser(req.body.userData)
    .then((data) => {
      const { statusCode, status, message } = data;
      return res.status(statusCode).send({
        status: status,
        message: message,
      });
    })
    .catch((error) => {
      console.error("Registration error:", error);
      const { statusCode, status, message } = error;
      return res.status(statusCode).send({
        status: status,
        message: message,
      });
    });
});

/**
 * @description This route is used to return user personal data.
 * It requires the user to be authenticated.
 */
userRouter.get("/personal-data", authenticateToken, async (req, res) => {
  getPersonalData(req.auth)
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
 * @description This route is used to update user data.
 */
userRouter.post(
  "/update",
  authenticateToken,
  userDataValidator,
  async (req, res) => {
    updatePersonalInfo(req.body.userData, req.auth)
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
 * @description This route is used to get the user table data.
 */
userRouter.post(
  "/table-data",
  authenticateToken,
  paginationData,
  async (req, res) => {
    const { paginationData } = req.body;

    getUserTableData(paginationData)
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
 * @description This route is used to return user list.
 * It requires the user to be authenticated.
 */
userRouter.post("/user-list", authenticateToken, async (req, res) => {
  getUserListData()
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
 * @description This route is used to change user password.
 * It requires the user to be authenticated.
 */
userRouter.post("/change-password", authenticateToken, async (req, res) => {
  const { oldPassword, newPassword, lg } = req.body;
  const authData = { ...req.auth, lg };
  changeUserPassword(oldPassword, newPassword, authData)
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

module.exports = {
  userRouter,
};
