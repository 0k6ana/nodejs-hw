import { User } from "../models/user.js";
import { Session } from "../models/session.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

import { sendEmail } from "../utils/sendMail.js";
import { createSession, setSessionCookies } from "../services/auth.js";

import fs from "fs";
import path from "path";
import handlebars from "handlebars";

import "dotenv/config";


// ========================
// REGISTER
// ========================
export const registerUser = async (req, res) => {
  const { email, password, username } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, "Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    username,
    password: hashedPassword,
  });

  // create session immediately
  const session = await createSession(user._id);
  setSessionCookies(res, session);

  res.status(201).json(user);
};


// ========================
// LOGIN
// ========================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, "Invalid credentials");
  }

  // remove old sessions
  await Session.deleteMany({ userId: user._id });

  const session = await createSession(user._id);
  setSessionCookies(res, session);

  res.json(user);
};


// ========================
// LOGOUT
// ========================
export const logoutUser = async (req, res) => {
  const sessionId = req.cookies?.sessionId;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  res.status(204).send();
};


// ========================
// REFRESH SESSION
// ========================
export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  const session = await Session.findById(sessionId);
  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  // verify token expiry
 try {
  await sendEmail({
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: "Password Reset",
    html,
  });

  res.status(200).json({
    message: "Password reset email sent successfully",
  });
} catch {
  throw createHttpError(500, "Failed to send email");
}

  if (session.refreshToken !== refreshToken) {
    throw createHttpError(401, "Invalid refresh token");
  }

  await Session.deleteOne({ _id: sessionId });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.json({
    message: "Session refreshed successfully",
  });
};


// ========================
// REQUEST RESET EMAIL
// ========================
export const requestResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      message: "Password reset email sent successfully",
    });
  }

  const token = jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const templatePath = path.join(
    process.cwd(),
    "src/templates/reset-password-email.html"
  );

  const templateSource = fs.readFileSync(templatePath, "utf-8");
  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.username,
    link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`,
  });

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      html,
    });

    res.status(200).json({
      message: "Password reset email sent successfully",
    });
  } catch {
    throw createHttpError(500, "Failed to send email");
  }
};


// ========================
// RESET PASSWORD
// ========================
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, "Invalid or expired token");
  }

  const user = await User.findOne({
    _id: payload.sub,
    email: payload.email,
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  await user.save();

  res.status(200).json({
    message: "Password reset successfully",
  });
};
