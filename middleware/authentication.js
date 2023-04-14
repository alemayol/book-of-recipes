import User from "../models/User.js";
import jwt from "jsonwebtoken";
import express from "express";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";

const authenticationMiddle = async function (req, res, next) {
  const $authHeader = req.headers.authorization || req.headers.Authorization;

  if (!$authHeader || !$authHeader.startsWith(`Bearer `)) {
    throw new UnauthenticatedError(`Authentication invalid`);
  }

  const bearerToken = $authHeader.split(` `)[1];

  try {
    const payload = jwt.verify(bearerToken, process.env.JWT_ACCESS_TOKEN);

    const user = await User.findById(payload.userID).select(`-password`);

    req.user = { userID: user._id, username: user.username };

    next();
  } catch (err) {
    throw new UnauthenticatedError(`Authentication invalid`);
  }
};

export default authenticationMiddle;
