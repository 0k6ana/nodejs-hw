import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { createSession, setSessionCookies, clearSessionCookies } from "../services/auth.js";

// REGISTER
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw createHttpError(400, "Email in use");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword });

    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(401, "Invalid email or password");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw createHttpError(401, "Invalid email or password");

    await Session.deleteMany({ userId: user._id });

    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(200).json({ message: "Logged in successfully", user });
  } catch (error) {
    next(error);
  }
};

// LOGOUT
export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;
    if (sessionId) await Session.findByIdAndDelete(sessionId);

    clearSessionCookies(res);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// REFRESH SESSION
export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;
    if (!sessionId || !refreshToken) throw createHttpError(401, "No session or refresh token");

    const session = await Session.findById(sessionId);
    if (!session || session.refreshToken !== refreshToken) throw createHttpError(401, "Invalid session or refresh token");

    const now = new Date();
    if (session.refreshTokenExpiresAt < now) {
      await Session.findByIdAndDelete(sessionId);
      throw createHttpError(401, "Refresh token expired");
    }

    await Session.findByIdAndDelete(sessionId);
    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);

    res.status(200).json({ message: "Session refreshed successfully" });
  } catch (error) {
    next(error);
  }
};
