import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, `Please provide an username`],
      maxlength: 20,
      unique: [true, `Username already exists, please try a new one`],
    },
    email: {
      type: String,
      required: [true, `Please provide a valid email`],
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

// UserSchema.pre(`save`, async function (next) {
//   const salt = await bcrypt.genSalt(10);

//   this.refreshToken = await bcrypt.hash(this.refreshToken, salt);
// });

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

// UserSchema.methods.compareTokens = async function (token) {
//   const isValid = await bcrypt.compare(token, this.refreshToken);

//   return isValid;
// };

export default mongoose.model(`User`, UserSchema);
