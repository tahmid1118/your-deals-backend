const _ = require("lodash");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const dealDataValidator = async (req, res, next) => {
  const updateUrl = req.originalUrl === "/deal/update";
  const dealData = {
    lg: req.body.lg || 'en',
    dealId: req.body.dealId ? parseInt(req.body.dealId) : undefined,
    dealTitle: req.body.dealTitle,
    dealDetails: req.body.dealDetails,
    sourceFacebook: req.body.sourceFacebook,
    sourceWebsite: req.body.sourceWebsite,
    sourceInstagram: req.body.sourceInstagram,
    dealChannel: req.body.dealChannel,
    dealType: req.body.dealType,
    dealStartDatetime: req.body.dealStartDatetime,
    dealEndDatetime: req.body.dealEndDatetime,
    rating: req.body.rating ? parseInt(req.body.rating) : undefined,
    branchId: req.body.branchId ? parseInt(req.body.branchId) : undefined,
    shopId: req.body.shopId ? parseInt(req.body.shopId) : undefined,
  };

  // Check if language is provided
  if (_.isEmpty(dealData.lg)) {
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
    if (_.isNil(dealData.dealId) || !_.isNumber(dealData.dealId)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'deal_id_is_required',
            dealData.lg
          )
        );
    }
  } else {
    delete dealData.dealId;
  }

  // Validate deal title
  if (!updateUrl) {
    if (_.isEmpty(dealData.dealTitle) || _.isNil(dealData.dealTitle)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'deal_title_is_required',
            dealData.lg
          )
        );
    }
  }

  if (!_.isNil(dealData.dealTitle)) {
    if (dealData.dealTitle.length < 2 || dealData.dealTitle.length > 200) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'deal_title_must_be_between_2_and_200_characters',
            dealData.lg
          )
        );
    }
  }

  // Validate deal details
  if (!_.isNil(dealData.dealDetails) && dealData.dealDetails.length > 200) {
    return res
      .status(API_STATUS_CODE.BAD_REQUEST)
      .send(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'deal_details_must_be_less_than_200_characters',
          dealData.lg
        )
      );
  }

  // Validate URLs
  if (!_.isNil(dealData.sourceFacebook) && dealData.sourceFacebook.length > 200) {
    return res
      .status(API_STATUS_CODE.BAD_REQUEST)
      .send(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'value_must_not_exceed_200_characters',
          dealData.lg
        )
      );
  }

  if (!_.isNil(dealData.sourceWebsite) && dealData.sourceWebsite.length > 200) {
    return res
      .status(API_STATUS_CODE.BAD_REQUEST)
      .send(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'value_must_not_exceed_200_characters',
          dealData.lg
        )
      );
  }

  if (!_.isNil(dealData.sourceInstagram) && dealData.sourceInstagram.length > 200) {
    return res
      .status(API_STATUS_CODE.BAD_REQUEST)
      .send(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'value_must_not_exceed_200_characters',
          dealData.lg
        )
      );
  }

  // Validate deal channel
  if (!updateUrl) {
    if (_.isEmpty(dealData.dealChannel) || _.isNil(dealData.dealChannel)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'deal_channel_is_required',
            dealData.lg
          )
        );
    }
  }

  if (!_.isNil(dealData.dealChannel)) {
    const validChannels = ['online', 'physical', 'both'];
    if (!validChannels.includes(dealData.dealChannel)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'deal_channel_must_be_online_physical_or_both',
            dealData.lg
          )
        );
    }
  }

  // Validate deal type
  if (!_.isNil(dealData.dealType) && dealData.dealType.length > 100) {
    return res
      .status(API_STATUS_CODE.BAD_REQUEST)
      .send(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'deal_type_must_be_less_than_100_characters',
          dealData.lg
        )
      );
  }

  // Validate rating
  if (!_.isNil(dealData.rating)) {
    if (!_.isInteger(dealData.rating) || dealData.rating < 0) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'rating_must_be_a_non_negative_integer',
            dealData.lg
          )
        );
    }
  }

  // Validate shop ID
  if (!updateUrl) {
    if (_.isNil(dealData.shopId) || !_.isNumber(dealData.shopId)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'shop_id_is_required',
            dealData.lg
          )
        );
    }
  }

  // Validate branch ID (optional)
  if (!_.isNil(dealData.branchId) && !_.isNumber(dealData.branchId)) {
    return res
      .status(API_STATUS_CODE.BAD_REQUEST)
      .send(
        setServerResponse(
          API_STATUS_CODE.BAD_REQUEST,
          'invalid_branch_id',
          dealData.lg
        )
      );
  }

  req.body.dealData = dealData;
  next();
};

module.exports = {
  dealDataValidator,
};
