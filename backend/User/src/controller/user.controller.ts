import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { findOrCreateUser } from "../services/auth.service.js";
import { appDB } from "../config/db.js";
import { generateToken } from "../config/generateToken.js";
import jwt from 'jsonwebtoken'
import { redisClient } from "../config/redis.js";
import {randomUUID} from "crypto"
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

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const deviceId= randomUUID();

    console.log(user);

    const { accessToken, refreshToken } = generateToken(user, deviceId);

    // cookies set
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, //***** */
      sameSite: "lax",
    })

    await redisClient.set(
      `refresh:${user.id}:${deviceId}`,
      refreshToken,
      { EX: 60 * 60 * 24 * 15 } // 15 days
    );


    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.json({
      message: "Login successful",
      user: safeUser,
      accessToken,
      deviceId
    });

  } catch (error: any) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({
        message: "No refresh token"
      })
    }
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    );
    const key= `refresh:${decoded.id}:${decoded.deviceId}`
    const storedToken = await redisClient.get(key);

    if (!storedToken || storedToken !== token) {
      return res.status(401).json({ message: "Invalid session" });
    }

    const userRes = await appDB.query(
      "SELECT id, college_id, role FROM users WHERE id=$1",
      [decoded.id]
    );
    const user = userRes.rows[0];


    const accessToken = jwt.sign(
      {
        id: user.id,
        college_id: user.college_id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );
    res.json({
      accessToken
    })
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET as string
      );

      // delete from redis
      await redisClient.del(`refresh:${decoded.id}`);
    }

    // cookie clear
    res.clearCookie("refreshToken");

    res.json({
      message: "Logged out successfully",
    });

  } catch (error) {
    res.status(500).json({ message: "Logout error" });
  }
};


export const setPassword = async (req: Request, res: Response) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        message: "UserId and password required",
      });
    }

    //Step 1: check user
    const result = await appDB.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    //already password set
    if (user.password) {
      return res.status(400).json({
        message: "Password already set. Use reset-password",
      });
    }

    //Step 2: set password (first time only)
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

// forgot reset Password
export const forgotResetPassword = async (
  req: Request,
  res: Response
) => {

  try {

    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password required",
      });
    }

    await resetPasswordService(
      email,
      newPassword
    );

    res.json({
      message: "Password reset successful",
    });

  } catch (error: any) {

    res.status(400).json({
      message: error.message,
    });

  }
};


export const resetPassword = async (req: any, res: Response) => {
  try {
    const userId = req.user.id; //token se userId lo
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password and new password required",
      });
    }

    //user fetch
    const result = await appDB.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    //old password check
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Old password is incorrect",
      });
    }

    // new password hash
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //update password
    await appDB.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, userId]
    );

    res.json({
      message: "Password updated successfully",
    });

  } catch (error: any) {
    console.error("Reset password error:", error.message);
    res.status(500).json({
      message: "Internal server error",
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