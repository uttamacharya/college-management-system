"use client";

import { useState } from "react";

import Link from "next/link";

import {
  Eye,
  EyeOff,
  CreditCard,
  Lock,
} from "lucide-react";

import {
  useVerifyId,
  useLogin,
} from "@/hooks/useAuth";

import { Button } from "@/components/ui/Button";

import { Input } from "@/components/ui/Input";

export function LoginForm() {

  // AUTH STEP

  const [authStep, setAuthStep] =
    useState<
      "verify" |
      "login" |
      "create-password"
    >("verify");

  // STATES

  const [collegeId, setCollegeId] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [userId, setUserId] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // HOOKS

  const verifyMutation =
    useVerifyId();

  const loginMutation =useLogin();

  // VERIFY ID

  const handleVerify = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setErrorMessage("");

    try {

      const response =
        await verifyMutation.mutateAsync({
          collegeId,
        });

      // FIRST TIME USER
      if (
        response.firstTime
      ) {

        setUserId(
          response.userId || ""
        );

        setAuthStep(
          "create-password"
        );

        return;
      }

    } catch (error: any) {

      const message =
        error.response?.data?.message;

      // EXISTING USER
      if (
        message ===
        "Password is required"
      ) {

        setAuthStep("login");

      } else {

        setErrorMessage(
          message ||
          "Verification failed"
        );
      }
    }
  };

  // LOGIN

  const handleLogin = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setErrorMessage("");

    loginMutation.mutate(
      {
        collegeId,
        password,
      },
      {
        onError: (
          error: any
        ) => {

          setErrorMessage(
            error.response?.data
              ?.message ||
            "Login failed"
          );
        },
      }
    );
  };

  // CREATE PASSWORD

  const handleCreatePassword =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        // console.log({
        //   userId,
        //   password,
        // });

        // CALL SET PASSWORD API HERE

      } catch (error: any) {

        setErrorMessage(
          error.response?.data
            ?.message ||
          "Failed to create password"
        );
      }
    };

  // SUBMIT HANDLER

  const handleSubmit = (
    e: React.FormEvent
  ) => {

    if (
      authStep === "verify"
    ) {

      handleVerify(e);

    } else if (
      authStep === "login"
    ) {

      handleLogin(e);

    } else {

      handleCreatePassword(e);
    }
  };

  // UI

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* HEADER */}

      <div className="text-center">

        <h1 className="text-4xl font-bold text-white">

          CollegeAssist

        </h1>

        <p className="mt-3 text-sm text-dark-400">

          {

            authStep === "verify"

              ? "Verify your College ID"

              : authStep === "login"

              ? "Login to your account"

              : "Create your password"
          }

        </p>
      </div>

      {/* COLLEGE ID */}

      <Input
        label="College ID"
        placeholder="Enter your college ID"
        value={collegeId}
        onChange={(e) =>
          setCollegeId(
            e.target.value
          )
        }
        icon={
          <CreditCard className="h-5 w-5" />
        }
        disabled={
          authStep !== "verify"
        }
        required
      />

      {/* PASSWORD */}

      {authStep !== "verify" && (

        <div className="relative">

          <Input
            label="Password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder={
              authStep === "login"
                ? "Enter your password"
                : "Create your password"
            }
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            icon={
              <Lock className="h-5 w-5" />
            }
            required
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="absolute right-3 top-9 text-dark-400 hover:text-white"
          >

            {showPassword ? (

              <EyeOff className="h-5 w-5" />

            ) : (

              <Eye className="h-5 w-5" />
            )}

          </button>
        </div>
      )}

      {/* FORGOT PASSWORD */}

      {authStep === "login" && (

        <div className="flex items-center justify-end">

          <Link
            href="/forgot-password"
            className="text-sm text-primary-500 hover:text-primary-400"
          >

            Forgot password?

          </Link>
        </div>
      )}

      {/* ERROR */}

      {errorMessage && (

        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

          {errorMessage}

        </div>
      )}

      {/* BUTTON */}

      <Button
        type="submit"
        className="w-full"
        isLoading={
          verifyMutation.isPending ||
          loginMutation.isPending
        }
      >

        {

          authStep === "verify"

            ? "Verify ID"

            : authStep === "login"

            ? "Login"

            : "Create Password"
        }

      </Button>

      {/* CHANGE ID */}

      {authStep !== "verify" && (

        <button
          type="button"
          onClick={() => {

            setAuthStep(
              "verify"
            );

            setPassword("");

            setErrorMessage("");

            setUserId("");
          }}
          className="w-full text-sm text-dark-400 hover:text-white"
        >

          Change College ID

        </button>
      )}

      {/* DEMO */}

      <p className="text-center text-sm text-dark-500">

        Demo IDs:{" "}

        <span className="font-medium text-dark-300">

          STU001

        </span>{" "}

        or{" "}

        <span className="font-medium text-dark-300">

          TCH001

        </span>

      </p>
    </form>
  );
}