import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useRouter } from "next/navigation";

import { authApi } from "@/api/auth.api";

import { useAuthStore } from "@/store/auth.store";

import {
  LoginRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  VerifyIdRequest,
  SetPasswordRequest,
} from "@/types/auth.types";


// VERIFY ID

export function useVerifyId() {

  return useMutation({

    mutationFn: async (
      data: VerifyIdRequest
    ) => {

      return authApi.login({
        collegeId: data.collegeId,
        password: "",
      });
    },
  });
}


// LOGIN

export function useLogin() {

  const router = useRouter();

  const setUser = useAuthStore(
    (state) => state.setUser
  );

  return useMutation({

    mutationFn: (
      data: LoginRequest
    ) => authApi.login(data),

    onSuccess: (
      response
    ) => {

      // safety check
      if (
        !response.user ||
        !response.accessToken
      ) {

        return;
      }

      // save auth
      setUser(
        response.user,
        response.accessToken
      );

      // role based redirect
      if (
        response.user.role ===
        "student"
      ) {

        router.push(
          "/dashboard/student"
        );

      } else if (
        response.user.role ===
        "teacher"
      ) {

        router.push(
          "/dashboard/teacher"
        );

      } else {

        router.push(
          "/dashboard"
        );
      }
    },
  });
}


// SET PASSWORD

export function useSetPassword() {

  const router = useRouter();

  return useMutation({

    mutationFn: (
      data: SetPasswordRequest
    ) => authApi.setPassword(data),

    onSuccess: () => {

      router.push("/login");
    },
  });
}


// LOGOUT

export function useLogout() {

  const router = useRouter();

  const logout = useAuthStore(
    (state) => state.logout
  );

  const queryClient =
    useQueryClient();

  return () => {

    logout();

    queryClient.clear();

    router.push("/login");
  };
}


// CURRENT USER

export function useCurrentUser() {

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated
    );

  return useQuery({

    queryKey: ["currentUser"],

    queryFn: () =>
      authApi.getMe(),

    enabled: isAuthenticated,

    staleTime:
      10 * 60 * 1000,
  });
}


// FORGOT PASSWORD

export function useForgotPassword() {

  return useMutation({

    mutationFn: (
      data: ForgotPasswordRequest
    ) =>
      authApi.forgotPassword(data),
  });
}


// VERIFY OTP

export function useVerifyOtp() {

  return useMutation({

    mutationFn: (
      data: VerifyOtpRequest
    ) =>
      authApi.verifyOtp(data),
  });
}


// RESET PASSWORD

export function useResetPassword() {

  const router = useRouter();

  return useMutation({

    mutationFn: (
      data: ResetPasswordRequest
    ) =>
      authApi.resetPassword(data),

    onSuccess: () => {

      router.push("/login");
    },
  });
}