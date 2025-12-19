const path = require("path");

const placeholderImagePath = "uploads/placeholder/placeholder-image.png";

/**
 * OTP expire time
 */
const OTP_EXPIRED_PERIOD_IN_MINS = 15;

const FRONTEND_URL = "http://192.168.88.25:3000/uxpmt/en";
const VERIFY_OTP_URL = "verify-otp";
const USER_LOGIN = "login";

module.exports = {
  placeholderImagePath,
  OTP_EXPIRED_PERIOD_IN_MINS,
  FRONTEND_URL,
  VERIFY_OTP_URL,
  USER_LOGIN,
};
