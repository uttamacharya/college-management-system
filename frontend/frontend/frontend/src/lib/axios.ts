import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/store/auth.store";


// BASE URLS

const USER_BASE_URL =process.env.NEXT_PUBLIC_USER_API ||
  "http://localhost:4000/api";

const NOTICE_BASE_URL =process.env.NEXT_PUBLIC_NOTICE_API ||
  "http://localhost:4002/api";

// AI BASE URL

const AI_BASE_URL =
  process.env.NEXT_PUBLIC_AI_API ||
  "http://localhost:4010/api/ai";


// USER CLIENT

export const userClient:
  AxiosInstance = axios.create({

    baseURL: USER_BASE_URL,

    withCredentials: true,

    timeout: 15000,

    headers: {
      "Content-Type":
        "application/json",
    },
  });


// NOTICE CLIENT

export const noticeClient:
  AxiosInstance = axios.create({

    baseURL: NOTICE_BASE_URL,

    withCredentials: true,

    timeout: 15000,

    headers: {
      "Content-Type":
        "application/json",
    },
  });

// AI CLIENT

export const aiClient:
  AxiosInstance = axios.create({

    baseURL: AI_BASE_URL,

    withCredentials: true,

    timeout: 15000,

    headers: {
      "Content-Type":
        "application/json",
    },
  });


// REQUEST INTERCEPTOR

const requestInterceptor = (
  config: InternalAxiosRequestConfig
) => {

  const token =
    useAuthStore.getState()
      .accessToken;

  if (
    token &&
    config.headers
  ) {

    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
};


// RESPONSE INTERCEPTOR

const responseErrorInterceptor =
  async (error: AxiosError) => {

    const originalRequest =
      error.config;

    if (
      error.response?.status === 401 &&
      originalRequest
    ) {

      const authStore =
        useAuthStore.getState();

      authStore.logout();
    }

    return Promise.reject(error);
  };


// APPLY INTERCEPTORS

[
  userClient,
  noticeClient,
  aiClient,
].forEach((client) => {

  client.interceptors.request.use(
    requestInterceptor,
    (error) =>
      Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    responseErrorInterceptor
  );
});


// DEFAULT EXPORT

export default userClient;