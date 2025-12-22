const _ = require("lodash");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");
const { isEmailValid, isPhoneNumberValid } = require("../../common/dataValidator");

const shopDataValidator = async (req, res, next) => {
  const updateUrl = req.originalUrl === "/shop/update";
  const shopData = {
    lg: req.body.lg || 'en',
    shopId: req.body.shopId ? parseInt(req.body.shopId) : undefined,
    shopName: req.body.shopName,
    shopDetails: req.body.shopDetails,
    shopEmail: req.body.shopEmail,
    shopContact: req.body.shopContact,
    shopContactAlternative: req.body.shopContactAlternative,
  };

  // Check if language is provided
  if (_.isEmpty(shopData.lg)) {
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
    if (_.isNil(shopData.shopId) || !_.isNumber(shopData.shopId)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'shop_id_is_required',
            shopData.lg
          )
        );
    }
  } else {
    delete shopData.shopId; // shop id cannot be set on create
  }

  // Validate shop name
  if (!updateUrl) {
    if (_.isEmpty(shopData.shopName) || _.isNil(shopData.shopName)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'shop_name_is_required',
            shopData.lg
          )
        );
    }

    if (shopData.shopName.length < 2 || shopData.shopName.length > 200) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'shop_name_must_be_between_2_and_200_characters',
            shopData.lg
          )
        );
    }
  }

  // Validate shop details (optional)
  if (!_.isNil(shopData.shopDetails) && !_.isEmpty(shopData.shopDetails)) {
    if (shopData.shopDetails.length > 200) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'shop_details_must_be_less_than_200_characters',
            shopData.lg
          )
        );
    }
  }

  // Validate shop email (optional but must be valid if provided)
  if (!_.isNil(shopData.shopEmail) && !_.isEmpty(shopData.shopEmail)) {
    const isValidEmail = isEmailValid(shopData.shopEmail);
    if (!isValidEmail) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'invalid_email_address',
            shopData.lg
          )
        );
    }
  }

  // Validate shop contact (optional but must be valid if provided)
  if (!_.isNil(shopData.shopContact) && !_.isEmpty(shopData.shopContact)) {
    const isValidContact = isPhoneNumberValid(shopData.shopContact);
    if (!isValidContact) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'invalid_shop_contact_number',
            shopData.lg
          )
        );
    }
  }

  // Validate alternative contact (optional but must be valid if provided)
  if (!_.isNil(shopData.shopContactAlternative) && !_.isEmpty(shopData.shopContactAlternative)) {
    const isValidAlternativeContact = isPhoneNumberValid(shopData.shopContactAlternative);
    if (!isValidAlternativeContact) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'invalid_shop_contact_alternative_number',
            shopData.lg
          )
        );
    }
  }

  req.body.shopData = shopData;
  next();
};

module.exports = {
  shopDataValidator,
};
