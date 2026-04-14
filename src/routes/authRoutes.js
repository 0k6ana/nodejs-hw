import express from "express";
import { celebrate } from "celebrate";
import { requestResetEmail, resetPassword } from "../controllers/authController.js";
import { requestResetEmailSchema, resetPasswordSchema } from "../validations/authValidation.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = express.Router();

router.post("/request-reset-email", celebrate(requestResetEmailSchema), catchAsync(requestResetEmail));
router.post("/reset-password", celebrate(resetPasswordSchema), catchAsync(resetPassword));

export default router;
