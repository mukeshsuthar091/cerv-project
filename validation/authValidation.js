import Joi from "joi";

// ------- send otp validation ---------

export const sendOtpValidation = Joi.object({
  phone_no: Joi.string().required().length(10),
  country_code: Joi.string().required().length(2),
});

// ------- resend otp validation ---------

export const resendOTPValidation = Joi.object({
  orderId: Joi.string().required(),
});

// ------- verify otp and user data validation ---------

export const verifyOTPValidation = Joi.object({
  otp: Joi.number().min(1000).max(9999).required(),
  orderId: Joi.string().required(),
  phone_no: Joi.string().required().length(10),
  country_code: Joi.string().required().length(2),
});

// ------- register validation ---------

export const userRegisterValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phone_no: Joi.string().required().length(10),
  country_code: Joi.string().required().length(2),
  role: Joi.string().valid("1", "2").required(),
  businessLicenseNum: Joi.string().alphanum().required(),
  address: Joi.string().required(),
  bio: Joi.string().required(),
  // orderType: Joi.string().required(),
  orderType: Joi.string(),
  // distanceFeeWaived: Joi.boolean().required(),
  distanceFeeWaived: Joi.boolean(),
  // distanceAndFeel: Joi.string().required(),
  distanceAndFeel: Joi.string(),
  foodCategory: Joi.string().required(),
  driverName: Joi.string().required(),
  driverLicenseNumber: Joi.string().required(),
});

// ------- login validation ---------

export const userLoginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  // role: Joi.string().valid("1", "2").required(),
});

// ------- forget password validation ---------

export const userForgetPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
});

// ------- reset password validation ---------

export const userResetPasswordValidation = Joi.object({
  password: Joi.string().required(),
});

// ------- change password validation ---------

export const userChangePasswordValidation = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});
