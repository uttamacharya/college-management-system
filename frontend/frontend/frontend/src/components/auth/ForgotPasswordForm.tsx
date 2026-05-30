"use client";

import {
  useState,
  useEffect
} from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  useForgotPassword,
  useVerifyOtp,
} from "@/hooks/useAuth";

import { Button } from "@/components/ui/Button";

import { Input } from "@/components/ui/Input";

import {
  Mail,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

type Step =
  | "email"
  | "otp";

export function ForgotPasswordForm() {

  // ROUTER

  const router = useRouter();

  // STATES

  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [timer, setTimer] = useState(60);

  const [canResend, setCanResend] = useState(false);

  // MUTATIONS

  const forgotPasswordMutation = useForgotPassword();

  const verifyOtpMutation = useVerifyOtp();

  useEffect(() => {

    let interval: NodeJS.Timeout;

    if (
      step === "otp" &&
      timer > 0
    ) {

      interval = setInterval(() => {

        setTimer(
          (prev) => prev - 1
        );

      }, 1000);

    } else if (timer === 0) {

      setCanResend(true);
    }

    return () =>
      clearInterval(interval);

  }, [step, timer]);

  // SEND OTP

  const handleEmailSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () =>
          setStep("otp"),
      }
    );
  };

  // VERIFY OTP

  const handleOtpSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    verifyOtpMutation.mutate(
      {
        email,
        otp,
      },
      {
        onSuccess: () => {

          alert(
            "OTP verified successfully"
          );

          router.push("/login");
        },
      }
    );
  };

  return (

    <div className="space-y-6">

      {/* Back to Login */}

      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white"
      >

        <ArrowLeft className="h-4 w-4" />

        Back to login

      </Link>

      {/* Step 1: Email */}

      {step === "email" && (

        <form
          onSubmit={
            handleEmailSubmit
          }
          className="space-y-6"
        >

          <div className="text-center">

            <h2 className="text-2xl font-bold text-white">

              Forgot Password

            </h2>

            <p className="mt-2 text-dark-400">

              Enter your email to receive a verification code

            </p>
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            icon={
              <Mail className="h-5 w-5" />
            }
            required
          />

          {forgotPasswordMutation.isError && (

            <p className="text-sm text-red-500">

              Failed to send OTP. Please try again.

            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            isLoading={
              forgotPasswordMutation.isPending
            }
          >

            Send Verification Code

          </Button>
        </form>
      )}

      {/* Step 2: OTP */}

      {step === "otp" && (

        <form
          onSubmit={
            handleOtpSubmit
          }
          className="space-y-6"
        >

          <div className="text-center">

            <h2 className="text-2xl font-bold text-white">

              Enter Verification Code

            </h2>

            <p className="mt-2 text-dark-400">

              We sent a code to {email}

            </p>
          </div>

          <div>

            <label className="mb-3 block text-sm font-medium text-dark-200">

              Verification Code

            </label>

            <div className="flex justify-between gap-2">

              {Array.from({ length: 6 }).map(
                (_, index) => (

                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(e) => {

                      const value =
                        e.target.value;

                      if (!/^\d?$/.test(value))
                        return;

                      const updatedOtp =
                        otp.split("");

                      updatedOtp[index] =
                        value;

                      setOtp(
                        updatedOtp.join("")
                      );

                      // next focus

                      if (
                        value &&
                        index < 5
                      ) {

                        const nextInput =
                          document.getElementById(
                            `otp-${index + 1}`
                          );

                        nextInput?.focus();
                      }

                    }}
                    onKeyDown={(e) => {

                      // move back on backspace

                      if (
                        e.key === "Backspace" &&
                        !otp[index] &&
                        index > 0
                      ) {

                        const prevInput =
                          document.getElementById(
                            `otp-${index - 1}`
                          );

                        prevInput?.focus();
                      }
                    }}
                    className="h-14 w-12 rounded-xl border border-dark-600 bg-dark-800 text-center text-lg font-semibold text-white outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  />
                )
              )}
            </div>
          </div>

          {verifyOtpMutation.isError && (

            <p className="text-sm text-red-500">

              Invalid code. Please try again.

            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            isLoading={
              verifyOtpMutation.isPending
            }
          >

            Verify Code

          </Button>

          <div className="text-center text-sm text-dark-400">

            {canResend ? (

              <button
                type="button"
                onClick={() => {

                  setTimer(60);

                  setCanResend(false);

                  forgotPasswordMutation.mutate({
                    email,
                  });
                }}
                className="text-primary-500 hover:text-primary-400"
              >

                Resend OTP

              </button>

            ) : (

              <p>

                Resend OTP in{" "}

                <span className="font-medium text-white">

                  00:
                  {timer
                    .toString()
                    .padStart(2, "0")}

                </span>

              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}