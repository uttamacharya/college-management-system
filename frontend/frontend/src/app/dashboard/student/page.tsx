"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { StatsCards } from "@/components/student/StatsCards";

import {
  useStudentMarks,
  useStudentNotices,
} from "@/hooks/useStudent";

// import { useTimetable } from "@/hooks/useTimetable";

import { NoticeCard } from "@/components/notice/NoticeCard";

import { MarksTable } from "@/components/student/MarksTable";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";

import { CardSkeleton } from "@/components/ui/Skeleton";

import { mapNotice } from "@/lib/notice.mapper";

export default function StudentDashboard() {

  // =========================
  // API CALLS
  // =========================

  const {
    data: noticesResponse,
    isLoading: noticesLoading,
  } = useStudentNotices(
    1,
    10
  );

  const {
    data: marksResponse,
    isLoading: marksLoading,
  } = useStudentMarks("");

  // const {
  //   data: timetable,
  //   isLoading: timetableLoading,
  // } = useTimetable();

  // =========================
  // DATA
  // =========================

  const notices =

    noticesResponse?.data?.map(
      mapNotice
    ) || [];

  const recentNotices =
    notices.slice(0, 3);

  const allMarks =
    marksResponse?.data || [];

  const latestSemester =

    allMarks.length > 0

      ? Math.max(
        ...allMarks.map(
          (item: any) =>
            Number(item.semester)
        )
      )

      : 1;

  const recentMarks =

    allMarks.filter(
      (item: any) =>

        Number(item.semester) ===
        latestSemester
    );

  // const todayClasses =

  //   timetable?.schedule?.[0]?.slots?.slice(0, 3) || [];

  // =========================
  // DASHBOARD STATS
  // =========================

  const overallCGPA =

    allMarks.length > 0

      ? (
        allMarks.reduce(
          (
            acc: number,
            item: any
          ) =>

            acc +
            Number(item.marks || 0),

          0
        ) / allMarks.length
      ).toFixed(2)

      : "0.00";

  const unreadCount =

    notices.filter(
      (notice: any) =>
        !notice.isRead
    ).length;

  const subjectCount =
    allMarks.length;

  // =========================
  // CUSTOM STATS
  // =========================

  const stats = [

    {
      title: "Overall CGPA",
      value: overallCGPA,
      icon: "graduation",
    },

    {
      title: "Unread Notices",
      value: unreadCount,
      icon: "notice",
    },

    {
      title: "Attendance",
      value: "--",
      icon: "attendance",
    },

    {
      title: "Subjects",
      value: subjectCount,
      icon: "subject",
    },
  ];

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div>

        <h1 className="text-2xl font-bold text-white">

          Student Dashboard

        </h1>

        <p className="text-dark-400">

          Welcome back! Here&apos;s your academic overview.

        </p>

      </div>

      {/* STATS */}

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">

        {/* RECENT NOTICES */}

        <div>

          <div className="mb-4 flex items-center justify-between">

            <h2 className="text-lg font-semibold text-white">

              Recent Notices

            </h2>

            <Link
              href="/dashboard/student/notices"
              className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-400"
            >

              View all

              <ArrowRight className="h-4 w-4" />

            </Link>

          </div>

          <div className="space-y-4">

            {noticesLoading ? (

              Array.from({
                length: 3,
              }).map((_, i) => (

                <CardSkeleton key={i} />
              ))

            ) : recentNotices.length > 0 ? (

              recentNotices.map(
                (notice: any) => (

                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    variant="student"
                  />
                )
              )

            ) : (

              <div className="rounded-xl border border-dark-800 bg-dark-900 p-6 text-center text-dark-400">

                No notices available

              </div>
            )}

          </div>

        </div>

        {/* TODAY'S CLASSES */}

        <Card>

          <CardHeader className="flex flex-row items-center justify-between">

            <CardTitle>

              Today&apos;s Classes

            </CardTitle>

            <Link
              href="/dashboard/student/timetable"
              className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-400"
            >

              Full schedule

              <ArrowRight className="h-4 w-4" />

            </Link>

          </CardHeader>

          <CardContent>

            {/* {timetableLoading ? (

              <div className="space-y-3">

                {Array.from({
                  length: 3,
                }).map((_, i) => (

                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-lg bg-dark-700"
                  />
                ))}

              </div>

            ) : todayClasses.length > 0 ? ( */}

              <div className="space-y-3">

                {/* {todayClasses.map(
                  (
                    slot: any,
                    index: number
                  ) => (

                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-dark-700/50 p-3"
                    >

                      <div>

                        <p className="font-medium text-white">

                          {slot.subjectName}

                        </p>

                        <p className="text-xs text-dark-400">

                          {slot.teacherName}

                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-sm text-white">

                          {slot.startTime} - {slot.endTime}

                        </p>

                        <p className="text-xs text-dark-400">

                          Room {slot.room}

                        </p>

                      </div>

                    </div>
                  )
                )} */}

              </div>

            ) : (

              <p className="py-8 text-center text-dark-400">

                No classes today

              </p>
            {/* )} */}

          </CardContent>

        </Card>

      </div>

      {/* RECENT MARKS */}

      <MarksTable
        marks={recentMarks}
        isLoading={marksLoading}
      />

    </div>
  );
}