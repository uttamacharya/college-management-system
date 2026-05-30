"use client";

import {
  GraduationCap,
  Bell,
  Calendar,
  BookOpen,
} from "lucide-react";

interface TeacherStatsCardsProps {

  stats: {
    title: string;
    value: string | number;
    icon: string;
  }[];
}

const iconMap: any = {

  classes: Calendar,

  notices: Bell,

  subjects: BookOpen,

  students: GraduationCap,
};

export function TeacherStatsCards({
  stats,
}: TeacherStatsCardsProps) {

  return (

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((item, index) => {

        const Icon =
          iconMap[item.icon] || GraduationCap;

        return (

          <div
            key={index}
            className="rounded-2xl border border-dark-800 bg-dark-900 p-6"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-dark-400">

                  {item.title}

                </p>

                <h3 className="mt-2 text-3xl font-bold text-white">

                  {item.value}

                </h3>

              </div>

              <div className="rounded-xl bg-primary-500/10 p-3">

                <Icon className="h-6 w-6 text-primary-500" />

              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
}