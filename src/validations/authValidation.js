import { Joi, Segments } from "celebrate";


// ========================
// REGISTER
// ========================
export const registerUserSchema = {
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};


// ========================
// LOGIN
// ========================
export const loginUserSchema = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};


// ========================
// REQUEST RESET EMAIL
// ========================
export const requestResetEmailSchema = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};


// ========================
// RESET PASSWORD
// ========================
export const resetPasswordSchema = {
  [Segments.BODY]: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),
};
