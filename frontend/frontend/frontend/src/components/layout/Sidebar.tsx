"use client";

import { useState } from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { useAuthStore } from "@/store/auth.store";

import {
  LayoutDashboard,
  Bell,
  BookOpen,
  Calendar,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MessageSquare,
} from "lucide-react";

interface NavItem {

  label: string;

  href: string;

  icon: React.ReactNode;
}


// STUDENT NAVIGATION

const studentNavItems: NavItem[] = [

  {
    label: "Dashboard",
    href: "/dashboard/student",
    icon: (
      <LayoutDashboard className="h-5 w-5" />
    ),
  },

  {
    label: "Notices",
    href: "/dashboard/student/notices",
    icon: (
      <Bell className="h-5 w-5" />
    ),
  },

  {
    label: "Messages",
    href: "/dashboard/student/messages",
    icon: (
      <MessageSquare className="h-5 w-5" />
    ),
  },

  {
    label: "Marks",
    href: "/dashboard/student/marks",
    icon: (
      <BookOpen className="h-5 w-5" />
    ),
  },

  {
    label: "Timetable",
    href: "/dashboard/student/timetable",
    icon: (
      <Calendar className="h-5 w-5" />
    ),
  },

  {
    label: "Profile",
    href: "/dashboard/student/profile",
    icon: (
      <User className="h-5 w-5" />
    ),
  },
];


// TEACHER NAVIGATION

const teacherNavItems: NavItem[] = [

  {
    label: "Dashboard",
    href: "/dashboard/teacher",
    icon: (
      <LayoutDashboard className="h-5 w-5" />
    ),
  },

  {
    label: "Notices",
    href: "/dashboard/teacher/notices",
    icon: (
      <Bell className="h-5 w-5" />
    ),
  },

  {
    label: "Messages",
    href: "/dashboard/teacher/messages",
    icon: (
      <MessageSquare className="h-5 w-5" />
    ),
  },

  {
    label: "Timetable",
    href: "/dashboard/teacher/timetable",
    icon: (
      <Calendar className="h-5 w-5" />
    ),
  },

  {
    label: "Settings",
    href: "/dashboard/teacher/settings",
    icon: (
      <Settings className="h-5 w-5" />
    ),
  },
];


// SIDEBAR COMPONENT

export function Sidebar() {


  // STATES


  const [collapsed, setCollapsed] =
    useState(false);


  // HOOKS


  const pathname =
    usePathname();

  const user = useAuthStore(
    (state) => state.user
  );


  // NAV ITEMS


  const navItems =
    user?.role === "teacher"
      ? teacherNavItems
      : studentNavItems;

  return (

    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-dark-800 bg-dark-900 transition-all duration-300",
        collapsed
          ? "w-20"
          : "w-64"
      )}
    >

      {/* LOGO */}

      <div className="flex h-16 items-center justify-between border-b border-dark-800 px-4">

        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >

          {/* ICON */}

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">

            <GraduationCap className="h-6 w-6 text-white" />

          </div>

          {/* BRAND */}

          {!collapsed && (

            <span className="text-lg font-bold text-white">

              CollegeAssist

            </span>
          )}
        </Link>

        {/* COLLAPSE BUTTON */}

        <button
          onClick={() =>
            setCollapsed(
              !collapsed
            )
          }
          className="rounded-lg p-1.5 text-dark-400 transition-colors hover:bg-dark-800 hover:text-white"
        >

          {collapsed ? (

            <ChevronRight className="h-5 w-5" />

          ) : (

            <ChevronLeft className="h-5 w-5" />
          )}

        </button>
      </div>

      {/* NAVIGATION */}

      <nav className="flex flex-col gap-1 p-4">

        {navItems.map((item) => {

          const isActive =
            pathname === item.href;

          return (

            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",

                isActive

                  ? "bg-primary-600/10 text-primary-500"

                  : "text-dark-300 hover:bg-dark-800 hover:text-white"
              )}
            >

              {/* ICON */}

              {item.icon}

              {/* LABEL */}

              {!collapsed && (

                <span>

                  {item.label}

                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}