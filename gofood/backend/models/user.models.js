import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcrypt";
import apiError from "../utils/apiErrors.js";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    geoLocation: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
  },
  {
    timestamps: true,
    writeConcern: { w: "majority", j: true, wtimeout: 5000 },
  }
);

// Hash password before saving if it has been modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const passwordRegex = /^.{8,}$/;
  if (!passwordRegex.test(this.password)) {
    return next(
      new apiError(400, "Password must be at least 8 characters long")
    );
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Check if the provided password matches the hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate JWT access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Generate JWT refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
