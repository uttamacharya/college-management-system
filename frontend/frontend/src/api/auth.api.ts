import apiClient from "@/lib/axios";

import {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  SetPasswordRequest,
  User,
} from "@/types/auth.types";

export const authApi = {

  // LOGIN

  login: async (
    data: LoginRequest
  ): Promise<LoginResponse> => {

    const response =
      await apiClient.post(
        "/auth/login",
        data
      );

    return response.data;
  },


  // REFRESH TOKEN

  refreshToken: async (): Promise<{
    accessToken: string;
  }> => {

    const response =
      await apiClient.post(
        "/auth/refresh-token"
      );

    return response.data;
  },


  // GET CURRENT USER

  getMe: async (): Promise<User> => {

    const response =
      await apiClient.get(
        "/auth/me"
      );

    return response.data;
  },


  // FORGOT PASSWORD

  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<{ message: string }> => {

    const response =
      await apiClient.post(
        "/auth/forgot-password",
        data
      );

    return response.data;
  },


  // VERIFY OTP

   verifyOtp: async (
    data: VerifyOtpRequest
  ): Promise<VerifyOtpResponse> => {

    const response =
      await apiClient.post(
        "/auth/verify-otp",
        data
      );

    return response.data;
  },


  // RESET PASSWORD

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<{ message: string }> => {

    const response =
      await apiClient.post(
        "/auth/reset-password",
        data
      );

    return response.data;
  },


  // SET PASSWORD

  setPassword: async (
    data: SetPasswordRequest
  ): Promise<{ message: string }> => {

    const response =
      await apiClient.post(
        "/auth/set-password",
        data
      );

    return response.data;
  },
};