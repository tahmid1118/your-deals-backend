const fs = require("fs");
const path = require("path");

const setServerResponse = (code, apiMessage, result = null) => {
  // Get the message from the JSON using the key
  const message = apiMessage;

  // Determine success or error status
  const statusType = code >= 200 && code < 300 ? "success" : "failed";
  const response = {
    statusCode: code,
    status: statusType,
    message,
  };

  if (result !== null) {
    response.result = result;
  }

  return response;
};

module.exports = {
  setServerResponse,
};
