import express from "express";

// controllers
import {
  login,
  setPassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
  myProfile,
} from "../controller/user.controller.js";

// middleware
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

//AUTH ROUTES

// login (collegeId + password)
router.post("/login", login);

// first time password set
router.post("/set-password", setPassword);

//PASSWORD RESET FLOW

// 1. send OTP
router.post("/forgot-password", forgotPassword);

// 2. verify OTP
router.post("/verify-otp", verifyOtp);

// 3. reset password
router.post("/reset-password", resetPassword);

// USER ROUTES

// protected route
router.get("/me", isAuth, myProfile);

export default router;