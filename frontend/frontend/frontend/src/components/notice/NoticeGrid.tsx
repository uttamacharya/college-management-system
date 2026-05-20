"use client";

import { Notice } from "@/types/notice.types";

import { NoticeCard } from "./NoticeCard";

import { EmptyState } from "@/components/ui/EmptyState";

import { CardSkeleton } from "@/components/ui/Skeleton";

interface NoticeGridProps {
  notices: Notice[];

  variant: "student" | "teacher";

  isLoading?: boolean;

  onCardClick?: (
    notice: Notice
  ) => void;

  onMarkRead?: (
    id: string
  ) => void;

  onToggleStar?: (
    id: string
  ) => void;

  onHide?: (
    id: string
  ) => void;

  onEdit?: (
    notice: Notice
  ) => void;

  onDelete?: (
    id: string
  ) => void;
}

export function NoticeGrid({
  notices,
  variant,
  isLoading,
  onCardClick,
  onMarkRead,
  onToggleStar,
  onHide,
  onEdit,
  onDelete,
}: NoticeGridProps) {

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

  if (!notices.length) {

    return (

      <EmptyState
        title={
          variant === "teacher"
            ? "No notices created"
            : "No notices found"
        }

        description={
          variant === "teacher"
            ? "You haven't created any notices yet."
            : "There are no notices to display right now."
        }
      />
    );
  }

  // GRID

  return (

    <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">

      {notices.map(
        (notice) => (

          <NoticeCard
            key={notice.id}

            notice={notice}

            variant={variant}

            onClick={() =>
              onCardClick?.(notice)
            }

            onMarkRead={onMarkRead}

            onToggleStar={onToggleStar}

            onHide={onHide}

            onEdit={onEdit}

            onDelete={onDelete}
          />
        )
      )}
    </div>
  );
}