"use client";

import {
  Timetable,
} from "@/types/timetable.types";

import {
  TimetableCard,
} from "./TimetableCard";

import {
  EmptyState,
} from "@/components/ui/EmptyState";

import {
  CardSkeleton,
} from "@/components/ui/Skeleton";

interface TimetableGridProps {

  timetable: Timetable[];

  isLoading?: boolean;

  onEdit?: (
    timetable: Timetable
  ) => void;
}

export function TimetableGrid({

  timetable,

  isLoading,

  onEdit,
}: TimetableGridProps) {

  // LOADING

  if (isLoading) {

    return (

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        {Array.from({
          length: 6,
        }).map((_, i) => (

          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // EMPTY

  if (!timetable.length) {

    return (

      <EmptyState
        title="No timetable found"
        description="You haven't created any classes yet."
      />
    );
  }

  // GRID

  return (

    <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">

      {timetable.map(
        (item) => (

          <TimetableCard
            key={item.id}

            timetable={item}

            onEdit={onEdit}
          />
        )
      )}
    </div>
  );
}