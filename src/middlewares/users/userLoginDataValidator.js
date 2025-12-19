const _ = require("lodash");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const userLoginDataValidator = async (req, res, next) => {
  const userData = {
    email: req.body.email,
    password: req.body.password,
  };

  // Check if email is provided
  if (!_.isEmpty(userData.email)) {
    if (typeof userData.email !== "string" || !userData.email.includes("@")) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(API_STATUS_CODE.BAD_REQUEST, "Email is required")
        );
    }
  }

  // Check if password is provided
  if (
    !userData.password ||
    typeof userData.password !== "string" ||
    userData.password.length < 6
  ) {
    return res
      .status(API_STATUS_CODE.BAD_REQUEST)
      .send(
        setServerResponse(API_STATUS_CODE.BAD_REQUEST, "Password is required")
      );
  }
  req.body.userData = userData;
  next();
};

module.exports = {
  userLoginDataValidator,
};
