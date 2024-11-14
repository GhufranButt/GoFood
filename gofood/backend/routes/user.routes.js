import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  loginUser,
  registerUser,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/registerUser").post(registerUser);
router.route("/login").post(loginUser);
// router.route("/verifyOtp").post(verifyJWT, verifyOtp);
// router.route("/sendOtp").post(verifyJWT, sendOtp);
// router.route("/resetPassword").post(resetPassword);

export default router;
