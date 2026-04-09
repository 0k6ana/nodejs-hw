import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { User } from "../models/user.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(createHttpError(401, "Unauthorized"));
  }

  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return next(createHttpError(401, "Unauthorized"));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.sub);

    if (!user) {
      return next(createHttpError(401, "Unauthorized"));
    }

    req.user = user;

    next();
  } catch {
    return next(createHttpError(401, "Unauthorized"));
  }
};
