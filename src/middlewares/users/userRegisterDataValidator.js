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
    lg: req.body.lg || 'en',
    userId: req.body.userId,
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    contact: req.body.contact,
  };

  // Check if language is provided
  if (_.isEmpty(userData.lg)) {
    return res
      .status(API_STATUS_CODE.BAD_REQUEST)
      .send(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'language_is_required',
          'en'
        )
      );
  }

  if (updateUrl) {
    if (_.isNil(userData.userId) || !_.isNumber(userData.userId)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'user_id_is_required',
            userData.lg
          )
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
          .send(
            setServerResponse(
              API_STATUS_CODE.BAD_REQUEST,
              isValid,
              userData.lg
            )
          );
      }
    }
  } else {
    if (!userData.fullName) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'user_full_name_is_required',
            userData.lg
          )
        );
    } else {
      const isValid = isUserNameValid(userData.fullName);
      if (isValid !== true) {
        return res
          .status(API_STATUS_CODE.BAD_REQUEST)
          .send(
            setServerResponse(
              API_STATUS_CODE.BAD_REQUEST,
              isValid,
              userData.lg
            )
          );
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
            'invalid_email_address',
            userData.lg
          )
        );
    } else {
      const isValid = isEmailValid(userData.email);
      if (isValid !== true) {
        return res
          .status(API_STATUS_CODE.BAD_REQUEST)
          .send(
            setServerResponse(
              API_STATUS_CODE.BAD_REQUEST,
              isValid,
              userData.lg
            )
          );
      }
    }
  } else {
    delete userData.email; //email cannot be updated
  }

  if (!userData.password) {
    return res
      .status(API_STATUS_CODE.BAD_REQUEST)
      .send(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'password_is_required',
          userData.lg
        )
      );
  } else {
    const isValid = isPasswordValid(userData.password);
    if (isValid !== true) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            isValid,
            userData.lg
          )
        );
    }
  }

  if (userData.contact) {
    const isValid = isPhoneNumberValid(userData.contact);
    if (isValid !== true) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            isValid,
            userData.lg
          )
        );
    }
  }

  req.body.userData = userData;
  next();
};

module.exports = {
  userDataValidator,
};
