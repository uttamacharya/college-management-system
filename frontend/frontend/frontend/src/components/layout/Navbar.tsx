"use client";

import { useState } from "react";

import { useAuthStore } from "@/store/auth.store";

import { useLogout } from "@/hooks/useAuth";

import { getInitials } from "@/lib/utils";

import {
  LogOut,
  User,
  ChevronDown,
  MessageSquare,
  CheckCheck,
  MailOpen,
} from "lucide-react";

export function Navbar() {

  // STATES

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const [messageOpen, setMessageOpen] =
    useState(false);

  // STORE

  const user = useAuthStore(
    (state) => state.user
  );

  const logout = useLogout();

  return (

    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-dark-800 bg-dark-900/95 px-6 backdrop-blur">

      {/* LEFT */}

      <div className="flex-1">

        <h1 className="text-lg font-semibold text-white">

          Welcome back,{" "}

          {user?.name?.split(" ")[0] || "User"}

        </h1>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-4">

        {/* MESSAGE DROPDOWN */}

        <div className="relative">

          <button
            onClick={() =>
              setMessageOpen(
                !messageOpen
              )
            }
            className="relative rounded-lg p-2 text-dark-400 transition-colors hover:bg-dark-800 hover:text-white"
          >

            <MessageSquare className="h-5 w-5" />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500" />

          </button>

          {messageOpen && (

            <>
              {/* Overlay */}

              <div
                className="fixed inset-0 z-40"
                onClick={() =>
                  setMessageOpen(false)
                }
              />

              {/* Dropdown */}

              <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-dark-700 bg-dark-800 py-2 shadow-xl">

                <div className="border-b border-dark-700 px-4 py-3">

                  <h3 className="text-sm font-semibold text-white">

                    Messages

                  </h3>

                </div>

                {/* UNREAD */}

                <button
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-dark-300 transition-colors hover:bg-dark-700 hover:text-white"
                >

                  <MailOpen className="h-4 w-4 text-primary-500" />

                  Unread Messages

                </button>

                {/* READ */}

                <button
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-dark-300 transition-colors hover:bg-dark-700 hover:text-white"
                >

                  <CheckCheck className="h-4 w-4 text-green-500" />

                  Read Messages

                </button>

              </div>
            </>
          )}
        </div>

        {/* USER DROPDOWN */}

        <div className="relative">

          <button
            onClick={() =>
              setDropdownOpen(
                !dropdownOpen
              )
            }
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-dark-800"
          >

            {/* AVATAR */}

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-medium text-white">

              {user
                ? getInitials(
                    user.name
                  )
                : "U"}

            </div>

            {/* USER INFO */}

            <div className="hidden text-left md:block">

              <p className="text-sm font-medium text-white">

                {user?.name || "User"}

              </p>

              <p className="text-xs capitalize text-dark-400">

                {user?.role || "Role"}

              </p>
            </div>

            <ChevronDown className="h-4 w-4 text-dark-400" />

          </button>

          {dropdownOpen && (

            <>
              {/* Overlay */}

              <div
                className="fixed inset-0 z-40"
                onClick={() =>
                  setDropdownOpen(false)
                }
              />

              {/* Menu */}

              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-dark-700 bg-dark-800 py-2 shadow-xl">

                {/* USER DETAILS */}

                <div className="border-b border-dark-700 px-4 py-3">

                  <p className="text-sm font-medium text-white">

                    {user?.name}

                  </p>

                  <p className="text-xs text-dark-400">

                    {user?.email}

                  </p>

                </div>

                {/* PROFILE */}

                <button
                  onClick={() =>
                    setDropdownOpen(false)
                  }
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-dark-300 transition-colors hover:bg-dark-700 hover:text-white"
                >

                  <User className="h-4 w-4" />

                  View Profile

                </button>

                {/* LOGOUT */}

                <button
                  onClick={() => {

                    setDropdownOpen(false);

                    logout();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-dark-700"
                >

                  <LogOut className="h-4 w-4" />

                  Sign Out

                </button>

              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}