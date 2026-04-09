import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { createSession, setSessionCookies } from "../services/auth.js";
import jwt from "jsonwebtoken";

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

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// LOGOUT
export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (sessionId) await Session.findByIdAndDelete(sessionId);


    res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none" });
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" });
    res.clearCookie("sessionId", { httpOnly: true, secure: true, sameSite: "none" });

    res.status(204).send();
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
    if (!session || session.refreshToken !== refreshToken)
      throw createHttpError(401, "Invalid session or refresh token");

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




import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendMail.js";

// REQUEST RESET EMAIL
export const requestResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      message: "Password reset email sent successfully",
    });
  }

  const token = jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`;

  try {
    await sendEmail({
      to: email,
      subject: "Reset password",
      html: `
        <h2>Hello ${user.username}</h2>
        <p>Click link:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.json({
      message: "Password reset email sent successfully",
    });
  } catch {
    throw createHttpError(
      500,
      "Failed to send the email, please try again later."
    );
  }
};

// RESET PASSWORD
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

  const hash = await bcrypt.hash(password, 10);

  user.password = hash;
  await user.save();

  res.json({
    message: "Password reset successfully",
  });
};
