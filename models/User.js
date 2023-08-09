import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, `Please provide an username`],
      match: [
        /^[A-z][A-z0-9-_]{3,23}$/i,
        `4 to 32 characters. Must begin with a letter. Letters, numbers, underscores hyphens allowed.`,
      ],
      unique: [true, `Username already exists, please try a new one`],
    },
    email: {
      type: String,
      required: [true, `Please provide an email`],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        `Email provided is not valid`,
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, `Please provide a password`],
      minlength: 6,
    },
    refreshTokens: [String],
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.createAccessJWT = function () {
  return jwt.sign(
    { userID: this._id, username: this.username },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: process.env.JWT_ACCESS_LIFESPAN }
  );
};

UserSchema.methods.createRefreshJWT = function () {
  return jwt.sign(
    { userID: this._id, username: this.username },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: process.env.JWT_REFRESH_LIFESPAN }
  );
};

UserSchema.methods.comparePasswords = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);

  return isMatch;
};

export default mongoose.model(`User`, UserSchema);
