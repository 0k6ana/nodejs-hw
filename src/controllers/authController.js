import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { createSession, setSessionCookies, clearSessionCookies } from "../services/auth.js";

// LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Шукаємо користувача
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, "Invalid email or password");
    }

    // Перевіряємо пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, "Invalid email or password");
    }

    // Видаляємо існуючі сесії користувача
    await Session.deleteMany({ userId: user._id });

    // Створюємо нову сесію
    const session = await createSession(user._id);

    // Встановлюємо куки
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

    if (sessionId) {
      // Видаляємо сесію з БД
      await Session.findByIdAndDelete(sessionId);
    }

    // Очищаємо куки
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

    if (!sessionId || !refreshToken) {
      throw createHttpError(401, "No session or refresh token");
    }

    const session = await Session.findById(sessionId);
    if (!session || session.refreshToken !== refreshToken) {
      throw createHttpError(401, "Invalid session or refresh token");
    }

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
