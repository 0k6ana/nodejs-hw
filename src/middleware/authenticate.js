import createHttpError from "http-errors";
import { Session } from "../models/session.js";
import { User } from "../models/user.js";

export const authenticate = async (req, res, next) => {
  try {
    let accessToken;

    if (req.headers.authorization) {
      const [type, token] = req.headers.authorization.split(" ");

      if (type === "Bearer") {
        accessToken = token;
      }
    }


    if (!accessToken && req.cookies?.accessToken) {
      accessToken = req.cookies.accessToken;
    }

    if (!accessToken) {
      throw createHttpError(401, "Not authorized");
    }

    const session = await Session.findOne({ accessToken });

    if (!session) {
      throw createHttpError(401, "Session not found");
    }

    if (new Date() > new Date(session.accessTokenValidUntil)) {
      throw createHttpError(401, "Access token expired");
    }

    const user = await User.findById(session.userId);

    if (!user) {
      throw createHttpError(401, "User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
