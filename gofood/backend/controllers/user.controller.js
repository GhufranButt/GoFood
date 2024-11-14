import asyncHandler from "../utils/asyncHandlers.js";
import apiError from "../utils/apiErrors.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Otp } from "../models/otp.models.js";
import verifyToken from "../helpers/verifyToken.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, geoLocation, password } = req.body;
  console.log("Request Body:", req.body);
  if (
    [fullName, email, geoLocation, password].some(
      (field) => String(field).trim() === ""
    )
  ) {
    throw new apiError(400, "This field is must Required");
  }

  const existingUser = await User.findOne({
    $or: [{ fullName }, { email }],
  });

  if (existingUser) {
    // Send a proper 409 status code for "User Already Exists"
    return res.status(409).json({
      success: false,
      message:
        "User already exists. Please try with a different email or full name.",
    });
  }

  const user = await User.create({
    fullName,
    email,
    geoLocation,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdUser, "User has been successfully registered")
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    throw new apiError(400, "Email and password are required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new apiError(400, "Invalid email format.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User does not exist. Please sign up.",
    });
    // throw new apiError(400, "User does not exist. Please sign up.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid password. Please try again." });
    // throw new apiError(401, "Invalid password. Please try again.");
  }

  if (user && isPasswordValid) {
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None", // Required for cross-site cookies
      path: "/", // Makes the cookie available for the entire app
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiry (adjust as needed)
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully."
        )
      );
  }
});

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  // console.log("-------->", req.body);

  if (!user) {
    throw new apiError(404, "User not found");
  }

  const { otp, otpExpiration } = await generateOtp(email);

  // Save the OTP in the database linked to the user
  await Otp.create({
    OTP: otp,
    otpExpiration,
    user: user._id,
  });

  // Respond with success message
  return res.status(200).json({
    success: true,
    message: `OTP sent successfully to ${email}`,
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { OTP } = req.body;

  const normalizedOtp = OTP.trim();

  const user = await Otp.findOne({ OTP: normalizedOtp });

  if (!user) {
    throw new apiError(404, "Invalid OTP");
  }

  // Check if the OTP has expired
  if (user.otpExpiration < Date.now()) {
    throw new apiError(400, "OTP has expired");
  }

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });

  await user.deleteOne();
});
const resetPassword = asyncHandler(async (req, res) => {
  // console.log("Request headers", req.headers);
  const { newPassword, confirmPassword } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    throw new apiError(401, "Unauthorized request");
  }

  const decodedToken = verifyToken(token);

  console.log("---------", decodedToken);

  if (!decodedToken) {
    throw new apiError(401, "Invalid or expired token");
  }

  const userId = decodedToken._id;
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Find the user by ID from the token
  const user = await User.findById(userId);
  if (!user) {
    throw new apiError(404, "User not found");
  }
  // console.log("----->", user);
  // Hash the new password (assuming you have a hashPassword function)
  // const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = newPassword;
  await user.save();
  // console.log("----->", user);
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "Password has been reset successfully" });

  // return res
  //   .status(200)
  //   .clearCookie("accessToken", options)
  //   .clearCookie("refreshToken", options)
  //   .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refresToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "Unauthorized Request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = User.findById(decodedToken?._id);

    if (!user) {
      throw new apiError(401, "Invalid refreshToken");
    }

    if (incomingRefreshToken !== user?.refresToken) {
      throw new apiError(401, "RefreshToken is expired or used");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refresToken: newRefreshToken },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid refresh token");
  }
});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  sendOtp,
  verifyOtp,
  resetPassword,
};
