const _ = require("lodash");
const { API_STATUS_CODE } = require("../../consts/errorStatus");
const { setServerResponse } = require("../../common/setServerResponse");

const categoryDataValidator = async (req, res, next) => {
  const updateUrl = req.originalUrl === "/category/update";
  const categoryData = {
    lg: req.body.lg || 'en',
    categoryId: req.body.categoryId,
    categoryTitle: req.body.categoryTitle,
    categoryDescription: req.body.categoryDescription,
    targetCustomer: req.body.targetCustomer,
  };

  // Check if language is provided
  if (_.isEmpty(categoryData.lg)) {
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
    if (_.isNil(categoryData.categoryId) || !_.isNumber(categoryData.categoryId)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'category_id_is_required',
            categoryData.lg
          )
        );
    }
  } else {
    delete categoryData.categoryId; // category id cannot be set on create
  }

  // Validate category title
  if (!updateUrl) {
    if (_.isEmpty(categoryData.categoryTitle) || _.isNil(categoryData.categoryTitle)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'category_title_is_required',
            categoryData.lg
          )
        );
    }

    if (categoryData.categoryTitle.length < 2 || categoryData.categoryTitle.length > 200) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'category_title_must_be_between_2_and_200_characters',
            categoryData.lg
          )
        );
    }
  }

  // Validate category description (optional)
  if (!_.isNil(categoryData.categoryDescription) && !_.isEmpty(categoryData.categoryDescription)) {
    if (categoryData.categoryDescription.length > 200) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'category_description_must_be_less_than_200_characters',
            categoryData.lg
          )
        );
    }
  }

  // Validate target customer
  if (!updateUrl) {
    if (_.isEmpty(categoryData.targetCustomer) || _.isNil(categoryData.targetCustomer)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'target_customer_is_required',
            categoryData.lg
          )
        );
    }

    const validTargetCustomers = ['men', 'women', 'kids'];
    if (!validTargetCustomers.includes(categoryData.targetCustomer)) {
      return res
        .status(API_STATUS_CODE.BAD_REQUEST)
        .send(
          setServerResponse(
            API_STATUS_CODE.BAD_REQUEST,
            'target_customer_must_be_men_women_or_kids',
            categoryData.lg
          )
        );
    }
  } else {
    // For update, validate only if provided
    if (!_.isNil(categoryData.targetCustomer) && !_.isEmpty(categoryData.targetCustomer)) {
      const validTargetCustomers = ['men', 'women', 'kids'];
      if (!validTargetCustomers.includes(categoryData.targetCustomer)) {
        return res
          .status(API_STATUS_CODE.BAD_REQUEST)
          .send(
            setServerResponse(
              API_STATUS_CODE.BAD_REQUEST,
              'target_customer_must_be_men_women_or_kids',
              categoryData.lg
            )
          );
      }
    }
  }

  req.body.categoryData = categoryData;
  next();
};

module.exports = {
  categoryDataValidator,
};
