import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-md rounded-2xl border border-dark-700 bg-dark-900 p-8 shadow-xl">

        <ForgotPasswordForm />

      </div>
    </div>
  );
}