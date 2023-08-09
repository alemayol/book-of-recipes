import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!PWD_REGEX.test(password)) {
    throw new BadRequestError(
      "Password must have 8 to 24 characters. 8 to 24 characters. Must include uppercase and lowercase letters, a number and a special character. Allowed special characters: !, @, #, $, %"
    );
  }

  const hashPass = await bcrypt.hash(password, 10);

  const user = await User.create({ username, email, password: hashPass });

  return res
    .status(StatusCodes.CREATED)
    .json({ user: { username: user.username }, ok: true });
};

const login = async (req, res) => {
  const { username, password } = req.body,
    { jwt: oldRefreshToken } = req.cookies;

  if (!username || !password)
    throw new BadRequestError(`Please provide both an username and a password`);

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

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
  });

  return res
    .status(StatusCodes.OK)
    .json({ user: { username: user.username }, accessToken, ok: true });
};

export { register, login };
