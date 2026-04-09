import { Router } from "express";
import { celebrate, Segments } from "celebrate";

import { registerUserSchema, loginUserSchema } from "../validations/authValidation.js";
import { registerUser, loginUser, logoutUser, refreshUserSession } from "../controllers/authController.js";

const router = Router();

// Register
router.post("/auth/register", celebrate({ [Segments.BODY]: registerUserSchema }), registerUser);

// Login
router.post("/auth/login", celebrate({ [Segments.BODY]: loginUserSchema }), loginUser);

// Logout
router.post("/auth/logout", logoutUser);

// Refresh session
router.post("/auth/refresh", refreshUserSession);

export default router;
