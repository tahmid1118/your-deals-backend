const _ = require("lodash");
const { parse, isValid } = require("date-fns");

//username validator
const isUserNameValid = (userName) => {
    const MINIMUM_LENGTH = 3;
    const MAXIMUM_LENGTH = 150;

    if (userName.length < MINIMUM_LENGTH) {
        return 'user_name_must_be_at_least_3_characters';
    }
    if (userName.length > MAXIMUM_LENGTH) {
        return 'user_name_must_not_exceed_150_characters';
    }
    return true;
}

//email validator
const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'invalid_email_address';
  }
  return true;
};

//contact no validator
const isPhoneNumberValid = (phoneNumber) => {
  const minLength = 10;
  const maxLength = 15;
  if (phoneNumber.length < minLength || phoneNumber.length > maxLength) {
    return 'invalid_user_phone_number';
  }
  return true;
};

//string validator
const commonStringDataValid = (commonData) => {
  const maxLength = 200;
  if (commonData.length > maxLength) {
    return 'value_must_not_exceed_200_characters';
  }
  if (typeof commonData !== "string") {
    return 'string_data_is_required';
  }
  return true;
};

//password validator
const isPasswordValid = (password) => {
  const minLength = 6;

  if (password.length < minLength) {
    return 'password_is_required';
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return 'password_must_contain_uppercase';
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return 'password_must_contain_lowercase';
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'password_must_contain_special_character';
  }

  return true;
};

module.exports = {
  isUserNameValid,
  isEmailValid,
  isPhoneNumberValid,
  commonStringDataValid,
  isPasswordValid,
};
