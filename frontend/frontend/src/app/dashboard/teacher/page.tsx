"use client";

import { TeacherStatsCards } from "@/components/teacher/TeacherStatsCards";

import {
  useTeacherDashboard,
} from "@/hooks/useTeacher";

import { NoticeCard } from "@/components/notice/NoticeCard";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";

import { CardSkeleton } from "@/components/ui/Skeleton";

import Link from "next/link";

import {
  ArrowRight,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

export default function TeacherDashboard() {

  const {

    stats,

    recentNotices,

    todayClasses,

    noticesLoading,

    timetableLoading,

  } = useTeacherDashboard();

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold text-white">

            Teacher Dashboard

          </h1>

          <p className="text-dark-400">

            Manage your classes and notices

          </p>

        </div>

        <Link href="/dashboard/teacher/notices">

          <Button>

            <Plus className="mr-2 h-4 w-4" />

            Create Notice

          </Button>

        </Link>

      </div>

      {/* STATS */}

      <TeacherStatsCards
        stats={stats}
      />

      <div className="grid gap-6 lg:grid-cols-2">

        {/* RECENT NOTICES */}

        <div>

          <div className="mb-4 flex items-center justify-between">

            <h2 className="text-lg font-semibold text-white">

              Your Recent Notices

            </h2>

            <Link
              href="/dashboard/teacher/notices"
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
                    variant="teacher"
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

        {/* TODAY CLASSES */}

        <Card>

          <CardHeader className="flex flex-row items-center justify-between">

            <CardTitle>

              Today&apos;s Classes

            </CardTitle>

            <Link
              href="/dashboard/teacher/timetable"
              className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-400"
            >

              Full schedule

              <ArrowRight className="h-4 w-4" />

            </Link>

          </CardHeader>

          <CardContent>

            {timetableLoading ? (

              <div className="space-y-3">

                {Array.from({
                  length: 4,
                }).map((_, i) => (

                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-lg bg-dark-700"
                  />

                ))}

              </div>

            ) : todayClasses.length > 0 ? (

              <div className="space-y-3">

                {todayClasses.map(
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

                          {slot.subject}

                        </p>

                        <p className="text-xs text-dark-400">

                          Room {slot.room}

                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-sm text-white">

                          {slot.start_time} - {slot.end_time}

                        </p>

                        <p className="text-xs text-dark-400">

                          Class

                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <p className="py-8 text-center text-dark-400">

                No classes today

              </p>

            )}

          </CardContent>

        </Card>

      </div>

    </div>
  );
}