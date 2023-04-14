import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";

const register = async (req, res) => {
  const { username, email, password } = req.body;

  const hashPass = await bcrypt.hash(password, 10);

  const user = await User.create({ username, email, password: hashPass });
  //   accessToken = await user.createAccessJWT(),
  //   refreshToken = await user.createRefreshJWT();

  // res.cookie(`jwt`, refreshToken, {
  //   httpOnly: true,
  //   maxAge: 24 * 60 * 60 * 1000,
  // });
  return res
    .status(StatusCodes.CREATED)
    .json({ user: { username: user.username } });
};

const login = async (req, res) => {
  const { username, password } = req.body,
    { jwt: oldRefreshToken } = req.cookies;

  if (!username || !password)
    throw new BadRequestError(`Please provide an username and password`);

  const user = await User.findOne({ username });

  if (!user) throw new UnauthenticatedError(`Invalid credentials`);

  const validatePassword = await user.comparePasswords(password);

  if (!validatePassword) throw new UnauthenticatedError(`Invalid credentials`);

  const accessToken = await user.createAccessJWT(),
    refreshToken = await user.createRefreshJWT();

  let newRefreshArr = !oldRefreshToken
    ? user.refreshTokens
    : user.refreshTokens.filter((rt) => rt !== oldRefreshToken);

  if (oldRefreshToken) {
    const isTokenValid = await User.findOne({ refreshToken: oldRefreshToken });

    if (!isTokenValid) {
      /* Attempted reuse of refresh token */
      newRefreshArr = [];
    }

    res.clearCookie("jwt", { httpOnly: true });
  }

  user.refreshTokens = [...newRefreshArr, refreshToken];
  await user.save();

  res.cookie(`jwt`, refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res
    .status(StatusCodes.OK)
    .json({ user: { name: user.username }, accessToken });
};

export { register, login };
