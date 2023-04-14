import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import {
  BadRequestError,
  UnauthenticatedError,
  ForbiddenError,
} from "../errors/index.js";

const refreshAuthentication = async function (req, res, next) {
  const { jwt: refreshToken } = req.cookies;

  if (!refreshToken) throw new UnauthenticatedError(`Missing credentials`);
  res.clearCookie("jwt", { httpOnly: true });

  try {
    const user = await User.findOne({ refreshTokens: refreshToken }).exec();

    /* Compromised refresh token cookie */
    if (!user) {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN,
        async (err, decode) => {
          if (err)
            throw new ForbiddenError(`An authentication error has occured`);

          const target = await User.findById(decode.userID);

          target.refreshTokens = [];
          await target.save();
        }
      );

      throw new ForbiddenError(`Authentication failed, please log in`);
    }

    const newRefreshArr = user.refreshTokens.filter(
      (rt) => rt !== refreshToken
    );

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN,
      async (err, dec) => {
        if (err) {
          user.refreshTokens = [...newRefreshArr];
          await user.save();

          // return res
          //   .status(StatusCodes.UNAUTHORIZED)
          //   .json({ msg: `Expired Token` });

          throw new UnauthenticatedError(
            `Session expired, please log in again`
          );
        }

        if (user.username !== dec.username)
          throw new ForbiddenError(`Not authenticated`);

        /* Refresh token was still valid */
        const newAccessToken = await user.createAccessJWT(),
          newRefreshToken = await user.createRefreshJWT();

        /* Update user's refresh token in database */
        user.refreshTokens = [...newRefreshArr, newRefreshToken];
        await user.save();

        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(StatusCodes.OK).json({ accessToken: newAccessToken });
      }
    );
  } catch (err) {
    throw new UnauthenticatedError(`Authentication invalid`);
  }
};

export default refreshAuthentication;
