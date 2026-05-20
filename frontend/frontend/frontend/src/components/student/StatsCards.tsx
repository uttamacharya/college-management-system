"use client";

import {
  Bell,
  BookOpen,
  Calendar,
  GraduationCap,
} from "lucide-react";

import { Card } from "@/components/ui/Card";

interface StatsCardItem {

  title: string;

  value: string | number;

  icon: string;
}

interface StatsCardsProps {

  stats?: StatsCardItem[];
}

export function StatsCards({
  stats = [],
}: StatsCardsProps) {

  const getIcon = (
    icon: string
  ) => {

    switch (icon) {

      case "graduation":

        return (
          <GraduationCap className="h-6 w-6 text-primary-400" />
        );

      case "notice":

        return (
          <Bell className="h-6 w-6 text-primary-400" />
        );

      case "attendance":

        return (
          <Calendar className="h-6 w-6 text-primary-400" />
        );

      case "subject":

        return (
          <BookOpen className="h-6 w-6 text-primary-400" />
        );

      default:

        return (
          <GraduationCap className="h-6 w-6 text-primary-400" />
        );
    }
  };

  return (

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      {stats.map(
        (
          item,
          index
        ) => (

          <Card
            key={index}
            className="border-dark-800 bg-dark-900 p-6"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-dark-400">

                  {item.title}

                </p>

                <h3 className="mt-2 text-3xl font-bold text-white">

                  {item.value}

                </h3>

              </div>

              <div className="rounded-xl bg-primary-500/10 p-4">

                {getIcon(item.icon)}

              </div>

            </div>

          </Card>
        )
      )}
    </div>
  );
}