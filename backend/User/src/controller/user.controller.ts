import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { findOrCreateUser } from "../services/auth.service.js";
import { appDB } from "../config/db.js";
import { generateToken } from "../config/generateToken.js";

//import services 
import {
  sendOtpService,
  verifyOtpService,
  resetPasswordService,
} from "../services/password.service.js";


// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { collegeId, password } = req.body;

    if (!collegeId) {
      return res.status(400).json({
        message: "College ID is required",
      });
    }

    const user = await findOrCreateUser(collegeId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // first time
    if (!user.password) {
      return res.json({
        message: "Set password first",
        firstTime: true,
        userId: user.id,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      user,
      token,
    });

  } catch (error: any) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


// SET PASSWORD
export const setPassword = async (req: Request, res: Response) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        message: "UserId and password required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await appDB.query(
      "UPDATE users SET password = $1, is_verified = true WHERE id = $2",
      [hashedPassword, userId]
    );

    res.json({
      message: "Password set successfully",
    });

  } catch (error: any) {
    console.error("Set password error:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


//FORGOT PASSWORD (clean)
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    await sendOtpService(email);

    res.json({
      message: "OTP sent to email",
    });

  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};


// VERIFY OTP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    await verifyOtpService(email, otp);

    res.json({
      message: "OTP verified",
    });

  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};


// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    await resetPasswordService(email, newPassword);

    res.json({
      message: "Password updated",
    });

  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};


// MY PROFILE
export const myProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    const result = await appDB.query(
      "SELECT id, email, name, role FROM users WHERE id = $1",
      [userId]
    );

    res.json(result.rows[0]);

  } catch (error: any) {
    console.error("Profile error:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};