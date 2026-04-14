import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { sendEmail } from "../utils/sendMail.js";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import "dotenv/config";
import bcrypt from "bcrypt";

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(200).json({ message: "Password reset email sent successfully" });


  const token = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });


  const templatePath = path.join(process.cwd(), "src/templates/reset-password-email.html");
  const templateSource = fs.readFileSync(templatePath, "utf-8");
  const template = handlebars.compile(templateSource);
  const html = template({ name: user.username, link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}` });

  try {
    await sendEmail(user.email, "Password Reset", html);
    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch {
    throw createHttpError(500, "Failed to send the email, please try again later.");
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, "Invalid or expired token");
  }

  const user = await User.findOne({ _id: payload.sub, email: payload.email });
  if (!user) throw createHttpError(404, "User not found");

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
};
