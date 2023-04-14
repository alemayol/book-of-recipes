import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";

const logout = async (req, res) => {
  const { jwt: refreshToken } = req.cookies;

  if (!refreshToken) return res.status(StatusCodes.NO_CONTENT);

  /* Checking if frefresh token is in DB */
  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(StatusCodes.NO_CONTENT);
  }

  /* Deleting refresh token in DB */

  user.refreshTokens = user.refreshTokens.filter((rt) => rt !== refreshToken);
  await user.save();

  return res.sendStatus(StatusCodes.NO_CONTENT);
};

export default logout;
