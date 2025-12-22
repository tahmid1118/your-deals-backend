const _ = require("lodash");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const branchDataValidator = async (req, res, next) => {
  const updateUrl = req.originalUrl === "/branch/update";
  const branchData = {
    lg: req.body.lg || 'en',
    branchId: req.body.branchId ? parseInt(req.body.branchId) : undefined,
    branchName: req.body.branchName,
    branchLocation: req.body.branchLocation,
    branchAddress: req.body.branchAddress,
    branchArea: req.body.branchArea,
    shopId: req.body.shopId ? parseInt(req.body.shopId) : undefined,
  };

  // Check if language is provided
  if (_.isEmpty(branchData.lg)) {
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
    if (_.isNil(branchData.branchId) || !_.isNumber(branchData.branchId)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'branch_id_is_required',
            branchData.lg
          )
        );
    }
  } else {
    delete branchData.branchId; // branch id cannot be set on create
  }

  // Validate branch name
  if (!updateUrl) {
    if (_.isEmpty(branchData.branchName) || _.isNil(branchData.branchName)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'branch_name_is_required',
            branchData.lg
          )
        );
    }

    if (branchData.branchName.length < 2 || branchData.branchName.length > 200) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'branch_name_must_be_between_2_and_200_characters',
            branchData.lg
          )
        );
    }
  }

  // Validate shop ID (required on create)
  if (!updateUrl) {
    if (_.isNil(branchData.shopId) || !_.isNumber(branchData.shopId)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'shop_id_is_required',
            branchData.lg
          )
        );
    }
  }

  // Validate branch location (optional)
  if (!_.isNil(branchData.branchLocation) && !_.isEmpty(branchData.branchLocation)) {
    if (branchData.branchLocation.length > 200) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'branch_location_must_be_less_than_200_characters',
            branchData.lg
          )
        );
    }
  }

  // Validate branch address (optional)
  if (!_.isNil(branchData.branchAddress) && !_.isEmpty(branchData.branchAddress)) {
    if (branchData.branchAddress.length > 200) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'branch_address_must_be_less_than_200_characters',
            branchData.lg
          )
        );
    }
  }

  // Validate branch area (optional)
  if (!_.isNil(branchData.branchArea) && !_.isEmpty(branchData.branchArea)) {
    if (branchData.branchArea.length > 200) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'branch_area_must_be_less_than_200_characters',
            branchData.lg
          )
        );
    }
  }

  req.body.branchData = branchData;
  next();
};

module.exports = {
  branchDataValidator,
};
