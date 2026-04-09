import express from "express";
import { updateUserAvatar } from "../controllers/userController.js";
import { upload } from "../middleware/multer.js";
import { authenticate } from "../middleware/authenticate.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = express.Router();

router.patch(
  "/me/avatar",
  authenticate,
  (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
      if (err) {
        console.error("💥 Multer Error:", err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  catchAsync(updateUserAvatar)
);

export default router;
