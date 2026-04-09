import { Joi, Segments } from "celebrate";

export const requestResetEmailSchema = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const resetPasswordSchema = {
  [Segments.BODY]: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
