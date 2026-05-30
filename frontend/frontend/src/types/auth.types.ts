export type UserRole =
  | "student"
  | "teacher"
  | "admin";


// USER
export interface User {

  id: string;

  college_id: string;

  name: string;

  email: string;

  role: UserRole;

  avatar?: string;

  department?: string;

  createdAt?: string;
}


// AUTH STATE

export interface AuthState {

  user: User | null;

  accessToken: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;
}


// LOGIN

export interface LoginRequest {

  collegeId: string;

  password: string;
}

export interface LoginResponse {

  user?: User;

  accessToken?: string;

  refreshToken?: string;

  firstTime?: boolean;

  userId?: string;

  message?: string;
}


// VERIFY ID

export interface VerifyIdRequest {

  collegeId: string;
}


// SET PASSWORD

export interface SetPasswordRequest {

  userId: string;

  password: string;
}


// FORGOT PASSWORD

export interface ForgotPasswordRequest {

  email: string;
}


// VERIFY OTP

export interface VerifyOtpRequest {

  email: string;

  otp: string;
}

export interface VerifyOtpResponse {

  verified?: boolean;

  message?: string;
}


// RESET PASSWORD

export interface ResetPasswordRequest {

  oldPassword: string;

  newPassword: string;
}