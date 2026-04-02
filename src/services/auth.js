import crypto from "crypto";
import { Session } from "../models/session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/time.js";

const generateToken = () => crypto.randomBytes(32).toString("hex");

export const createSession = async (userId) => {
  const accessToken = generateToken();
  const refreshToken = generateToken();

  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY);

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session;
};

export const setSessionCookies = (res, session) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", session.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: ONE_DAY,
  });

  res.cookie("sessionId", session._id.toString(), {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: ONE_DAY,
  });
};

export const clearSessionCookies = (res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("accessToken", { httpOnly: true, secure: isProduction, sameSite: isProduction ? "none" : "lax" });
  res.clearCookie("refreshToken", { httpOnly: true, secure: isProduction, sameSite: isProduction ? "none" : "lax" });
  res.clearCookie("sessionId", { httpOnly: true, secure: isProduction, sameSite: isProduction ? "none" : "lax" });
};
