const _ = require("lodash");
const { parse, isValid } = require("date-fns");

const taskStatus = [
  "Not Started",
  "In Progress",
  "Done For Review",
  "In Review",
  "Done",
  "Need Modification",
  "Testing",
  "Closed",
];

const taskPriority = ["Low", "Medium", "High", "Urgent", "Clear"];

//username validator
const isUserNameValid = (userName) => {
  const minLength = 3;
  const maxLength = 150;

  if (userName.length < minLength) {
    return "User name must be at least 3 characters";
  }
  if (userName.length > maxLength) {
    return "User name must not exceed 150 characters";
  }
  return true;
};

//email validator
const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email address";
  }
  return true;
};

//contact no validator
const isPhoneNumberValid = (phoneNumber) => {
  const minLength = 10;
  const maxLength = 15;
  if (phoneNumber.length < minLength || phoneNumber.length > maxLength) {
    return "Invalid phone number";
  }
  return true;
};

//string validator
const commonStringDataValid = (commonData) => {
  const maxLength = 200;
  if (commonData.length > maxLength) {
    return "Value must not exceed 200 characters";
  }
  if (typeof commonData !== "string") {
    return "String data is required";
  }
  return true;
};

//description validator
const isDescriptionValid = (description) => {
  const maxLength = 500;
  if (description.length > 0) {
    if (description.length > maxLength) {
      return "Description must not exceed 500 characters";
    }
  }
  return true;
};

//task status validator
const isValidTaskStatus = (status) => {
  if (!taskStatus.includes(status)) {
    return "Invalid task status";
  }
  return true;
};

//task priority validator
const isValidTaskPriority = (priority) => {
  if (!taskPriority.includes(priority)) {
    return "Invalid task priority";
  }
  return true;
};

//password validator
const isPasswordValid = (password) => {
  const minLength = 6;

  if (password.length < minLength) {
    return "Password must be at least 6 characters";
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return "Password must contain at least one special character";
  }

  return true;
};

module.exports = {
  isUserNameValid,
  isEmailValid,
  isPhoneNumberValid,
  commonStringDataValid,
  isDescriptionValid,
  isValidTaskStatus,
  isValidTaskPriority,
  isPasswordValid,
};
