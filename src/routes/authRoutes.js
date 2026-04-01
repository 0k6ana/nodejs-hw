import express from "express";
import { celebrate, Segments } from "celebrate";
import { registerUserSchema } from "../validations/authValidation.js";
import { registerUser } from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/auth/register",
  celebrate({
    [Segments.BODY]: registerUserSchema,
  }),
  registerUser
);

export default router;
