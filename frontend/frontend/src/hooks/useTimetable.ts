"use client";

import { useQuery } from "@tanstack/react-query";

export function useTeacherTimetable() {
  return useQuery({
    queryKey: ["teacher-timetable"],

    queryFn: async () => {
      return [
        {
          id: 1,
          day: "Monday",
          subject: "DBMS",
          start_time: "09:00 AM",
          end_time: "10:00 AM",
          room: "A-101",
        },

        {
          id: 2,
          day: "Tuesday",
          subject: "Operating System",
          start_time: "10:00 AM",
          end_time: "11:00 AM",
          room: "B-202",
        },

        {
          id: 3,
          day: "Wednesday",
          subject: "Computer Network",
          start_time: "11:00 AM",
          end_time: "12:00 PM",
          room: "C-303",
        },

        {
          id: 4,
          day: "Thursday",
          subject: "TOC",
          start_time: "01:00 PM",
          end_time: "02:00 PM",
          room: "D-404",
        },
      ];
    },
  });
}