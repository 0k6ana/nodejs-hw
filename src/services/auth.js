export const setSessionCookies = (res, session) => {
  res.cookie("accessToken", session.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: ONE_DAY,
  });

  res.cookie("sessionId", session._id.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: ONE_DAY,
  });
};

export const clearSessionCookies = (res) => {
  res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none" });
  res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" });
  res.clearCookie("sessionId", { httpOnly: true, secure: true, sameSite: "none" });
};
