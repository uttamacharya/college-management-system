import { LoginForm } from "@/components/auth/loginForm";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">CollegeAssist</span>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Welcome to your<br />Educational Portal
          </h1>
          <p className="text-lg text-primary-200 max-w-md">
            Access your academic information, notices, timetables, and more - all in one place.
          </p>
        </div>

        <p className="text-sm text-primary-300">
          © 2023 CollegeAssist. All rights reserved.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CollegeAssist</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Verify your ID and Login</h2>
            <p className="mt-2 text-dark-400">Enter your credentials to access your portal</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
