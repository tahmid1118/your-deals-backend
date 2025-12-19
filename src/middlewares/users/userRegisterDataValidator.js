const _ = require("lodash");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");
const {
  isUserNameValid,
  isPhoneNumberValid,
  isEmailValid,
  isPasswordValid,
} = require("../../common/dataValidator");

const userDataValidator = async (req, res, next) => {
  const updateUrl = req.originalUrl === "/users/update";
  const userData = {
    userId: req.body.userId,
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    contact: req.body.contact,
  };

  if (updateUrl) {
    if (_.isNil(userData.userId) || !_.isNumber(userData.userId)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(API_STATUS_CODE.BAD_REQUEST, "User id is required")
        );
    }
  } else {
    delete userData.userId; //user id cannot be updated
  }

  //check if fullname is provided
  if (updateUrl) {
    if (userData.fullName) {
      const isValid = isUserNameValid(userData.fullName);
      if (isValid !== true) {
        return res
          .status(API_STATUS_CODE.BAD_REQUEST)
          .send(setServerResponse(API_STATUS_CODE.BAD_REQUEST, isValid));
      }
    }
  } else {
    if (!userData.fullName) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            "User full name is required"
          )
        );
    } else {
      const isValid = isUserNameValid(userData.fullName);
      if (isValid !== true) {
        return res
          .status(API_STATUS_CODE.BAD_REQUEST)
          .send(setServerResponse(API_STATUS_CODE.BAD_REQUEST, isValid));
      }
    }
  }

  // Check if email is provided
  if (!updateUrl) {
    if (!userData.email) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            "Invalid email address"
          )
        );
    } else {
      const isValid = isEmailValid(userData.email);
      if (isValid !== true) {
        return res
          .status(API_STATUS_CODE.BAD_REQUEST)
          .send(setServerResponse(API_STATUS_CODE.BAD_REQUEST, isValid));
      }
    }
  } else {
    delete userData.email; //email cannot be updated
  }

  if (!userData.password) {
    return res
      .status(API_STATUS_CODE.BAD_REQUEST)
      .send(
        setServerResponse(API_STATUS_CODE.BAD_REQUEST, "Password is required")
      );
  } else {
    const isValid = isPasswordValid(userData.password);
    if (isValid !== true) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(setServerResponse(API_STATUS_CODE.BAD_REQUEST, isValid));
    }
  }

  if (userData.contact) {
    const isValid = isPhoneNumberValid(userData.contact);
    if (isValid !== true) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(setServerResponse(API_STATUS_CODE.BAD_REQUEST, isValid));
    }
  }

  req.body.userData = userData;
  next();
};

module.exports = {
  userDataValidator,
};
