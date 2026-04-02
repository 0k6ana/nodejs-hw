import { Router } from "express";
import { celebrate, Segments } from "celebrate";

import {
  registerUserSchema,
  loginUserSchema,
} from "../validations/authValidation.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
} from "../controllers/authController.js";

const router = Router();

// register
router.post(
  "/auth/register",
  celebrate({
    [Segments.BODY]: registerUserSchema,
  }),
  registerUser
);

// login
router.post(
  "/auth/login",
  celebrate({
    [Segments.BODY]: loginUserSchema,
  }),
  loginUser
);

// logout
router.post("/auth/logout", logoutUser);

// refresh
router.post("/auth/refresh", refreshUserSession);

export default router;
