import Joi from "joi";

// ------- send otp validation ---------

export const sendOtpValidation = Joi.object({
  phone_no: Joi.string().required().length(10).messages({
    "string.base": "Phone number must be a string",
    "string.length": "Phone number must be 10 digits long",
    "any.required": "Phone number is required",
  }),
  country_code: Joi.string().required().length(2).messages({
    "string.base": "Country code must be a string",
    "string.length": "Country code must be 2 digits long",
    "any.required": "Country code is required",
  }),
});

// ------- resend otp validation ---------

export const resendOTPValidation = Joi.object({
  orderId: Joi.string().required().messages({
    "string.empty": "Order ID cannot be empty",
    "any.required": "Order ID is required",
  }),
});

// ------- verify otp and user data validation ---------

const userDataSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name cannot be empty",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email cannot be empty",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
  phone_no: Joi.string().required().length(10).messages({
    "string.base": "Phone number must be a string",
    "string.length": "Phone number must be 10 digits long",
    "any.required": "Phone number is required",
  }),
  country_code: Joi.string().required().length(2).messages({
    "string.base": "Country code must be a string",
    "string.length": "Country code must be 2 digits long",
    "any.required": "Country code is required",
  }),
  role: Joi.string().valid("1", "2").required().messages({
    "string.base": "Role must be a string",
    "any.only": "Role must be either '1' (admin) or '2' (customer)",
    "any.required": "Role is required",
  }),
})
  .required()
  .messages({
    "object.base": "User data must be provided",
    "any.required": "User data is required",
  });

export const verifyOTPValidation = Joi.object({
  otp: Joi.number().min(1000).max(9999).required().messages({
    "number.base": "OTP must be a numeric value",
    "number.min": "OTP must be exactly 4 digits long",
    "number.max": "OTP must be exactly 4 digits long",
    "any.required": "OTP is required",
  }),
  orderId: Joi.string().required().messages({
    "string.empty": "Order ID cannot be empty",
    "any.required": "Order ID is required",
  }),
  userData: userDataSchema,
});

// ------- register validation ---------

export const userRegisterValidation = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid("1").required(),
  businessLicenseNum: Joi.string().alphanum().required(),
  address: Joi.string().required(),
  bio: Joi.string().required(),
  orderType: Joi.string().required(),
  distanceFeeWaived: Joi.boolean().required(),
  distanceAndFeel: Joi.string().required(),
  foodCategory: Joi.string().required(),
  driverName: Joi.string().required(),
  driverLicenseNumber: Joi.string().required(),
});



// ------- login validation ---------

export const userLoginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("1", "2").required(),
});

// ------- forget password validation ---------

export const userForgetPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid("1", "2").required(),
});

// ------- reset password validation ---------

export const userResetPasswordValidation = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

// ------- reset password validation ---------

export const userChangePasswordValidation = Joi.object({
  password: Joi.string().required(),
});
