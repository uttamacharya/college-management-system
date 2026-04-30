import { redisClient } from "../config/redis.js";
import { publishToQueue } from "../config/rabbitMQ.js";
import bcrypt from "bcrypt";
import { appDB } from "../config/db.js";

//OTP generate + send
export const sendOtpService = async (email: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redisClient.set(`otp:${email}`, otp, { EX: 300 });

  await publishToQueue("send-otp", {
    to: email,
    subject: "Password Reset OTP",
    body: `Your OTP is ${otp}`,
  });
};

//OTP verify
export const verifyOtpService = async (email: string, otp: string) => {
  const storedOtp = await redisClient.get(`otp:${email}`);

  if (!storedOtp || storedOtp !== otp) {
    throw new Error("Invalid or expired OTP");
  }

  await redisClient.del(`otp:${email}`);
};

// Reset password
export const resetPasswordService = async (
  email: string,
  newPassword: string
) => {
  const hashed = await bcrypt.hash(newPassword, 10);

  await appDB.query(
    "UPDATE users SET password = $1 WHERE email = $2",
    [hashed, email]
  );
};