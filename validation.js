const Joi = require("@hapi/joi");

const validateUser = (data) => {
  const userValidator = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmPwd: Joi.string().min(8).valid(Joi.ref('password')).required(),
  });

  return userValidator.validate(data);
};

const validateLogin = (data) => {
  const loginValidator = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  return loginValidator.validate(data);
};

const validateQuote = (data) => {
  const quoteValidator = Joi.object({
    firstName: Joi.string().min(3).max(50).required().label("First Name"),
    lastName: Joi.string().min(3).max(50).required().label("Last Name"),
    organizationName: Joi.string()
      .min(3)
      .max(50)
      .required()
      .label("Organization Name"),
    email: Joi.string().min(6).email().required().label("Email"),
    phone: Joi.string()
      .pattern(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid Phone Number",
      }),
    services: Joi.array()
      .items(Joi.string())
      .min(1)
      .required()
      .label("Services"),
    sizeOfLown: Joi.string().required().label("Size of Lown"),
    additionalRequest: Joi.string().allow("").label("Additional Request"),
    dateFrom: Joi.date()
      .iso()
      .min(new Date().setHours(0, 0, 0, 0))
      .required()
      .messages({
        "date.min": "Past Date is not allowed",
      }),
    dateTo: Joi.date()
      .iso()
      .min(new Date().setHours(0, 0, 0, 0))
      .required()
      .messages({
        "date.min": "Past Date is not allowed",
      }),
  });

  return quoteValidator.validate(data);
};

module.exports.validateUser = validateUser;
module.exports.validateLogin = validateLogin;
module.exports.validateQuote = validateQuote;
