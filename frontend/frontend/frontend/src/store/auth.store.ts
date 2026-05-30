"use client";

import { create } from "zustand";

import { persist } from "zustand/middleware";

import {
  AuthState,
  User,
} from "@/types/auth.types";

interface AuthStore
  extends AuthState {

  // hydration state

  isHydrated: boolean;

  setHydrated: (
    state: boolean
  ) => void;

  // auth actions

  setUser: (
    user: User,
    token: string
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthStore>()(

    persist(

      (set) => ({

        // =========================
        // STATES
        // =========================

        user: null,

        accessToken: null,

        isAuthenticated: false,

        isLoading: false,

        isHydrated: false,

        // =========================
        // HYDRATION
        // =========================

        setHydrated: (
          state
        ) =>

          set({
            isHydrated: state,
          }),

        // =========================
        // LOGIN
        // =========================

        setUser: (
          user,
          token
        ) =>

          set({

            user,

            accessToken: token,

            isAuthenticated: true,
          }),

        // =========================
        // LOGOUT
        // =========================

        logout: () =>

          set({

            user: null,

            accessToken: null,

            isAuthenticated: false,
          }),
      }),

      {
        name: "auth-storage",

        onRehydrateStorage:
          () => (state) => {

            state?.setHydrated(
              true
            );
          },
      }
    )
  );