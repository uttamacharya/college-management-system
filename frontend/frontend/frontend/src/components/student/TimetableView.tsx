"use client";

import { Timetable, DayOfWeek, TimeSlot } from "@/types/timetable.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

interface TimetableViewProps {
  timetable?: Timetable;
  isLoading?: boolean;
}

const dayOrder: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const dayLabels: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

const slotTypeColors: Record<string, string> = {
  lecture: "bg-primary-600/20 border-primary-600",
  lab: "bg-green-600/20 border-green-600",
  tutorial: "bg-yellow-600/20 border-yellow-600",
};

function TimeSlotCard({ slot }: { slot: TimeSlot }) {
  return (
    <div className={`p-3 rounded-lg border-l-4 ${slotTypeColors[slot.type]} bg-dark-700/50`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-dark-400">
          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
        </span>
        <Badge variant="default" className="text-xs capitalize">{slot.type}</Badge>
      </div>
      <p className="font-medium text-white text-sm">{slot.subjectName}</p>
      <p className="text-xs text-dark-400">{slot.subjectCode}</p>
      <div className="flex items-center justify-between mt-2 text-xs text-dark-400">
        <span>{slot.teacherName}</span>
        <span>Room {slot.room}</span>
      </div>
    </div>
  );
}

export function TimetableView({ timetable, isLoading }: TimetableViewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!timetable) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-dark-400 py-8">No timetable available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Timetable</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dayOrder.map((day) => {
            const daySchedule = timetable.schedule.find((s) => s.day === day);
            return (
              <div key={day}>
                <h4 className="font-semibold text-white mb-3">{dayLabels[day]}</h4>
                {daySchedule && daySchedule.slots.length > 0 ? (
                  <div className="space-y-3">
                    {daySchedule.slots.map((slot) => (
                      <TimeSlotCard key={slot.id} slot={slot} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-dark-400 py-4 text-center bg-dark-700/30 rounded-lg">
                    No classes
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
