"use client";

import { Notice } from "@/types/notice.types";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

import { formatDateTime } from "@/lib/utils";

import {
  Star,
  CheckCircle,
  EyeOff,
  Pencil,
  Trash2,
  Clock,
  User,
} from "lucide-react";

interface NoticeCardProps {
  notice: Notice;

  variant: "student" | "teacher";

  onClick?: () => void;

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

const priorityConfig = {

  low: {
    label: "Low",
    variant: "default",
  },

  medium: {
    label: "Medium",
    variant: "info",
  },

  high: {
    label: "High",
    variant: "warning",
  },

  urgent: {
    label: "Urgent",
    variant: "danger",
  },
};

const categoryConfig = {

  academic: "Academic",

  event: "Event",

  exam: "Exam",

  general: "General",

  holiday: "Holiday",
};

export function NoticeCard({

  notice,

  variant,

  onClick,

  onMarkRead,

  onToggleStar,

  onHide,

  onEdit,

  onDelete,

}: NoticeCardProps) {

  // READ STATUS

  const isRead =

    notice.isRead ||
    notice.is_read;

  // STAR STATUS

  const isStarred =

    notice.isStarred ||
    notice.is_starred;

  // PRIORITY

  // const priorityKey =

  //   (
  //     notice.priority ||
  //     "medium"
  //   ).toLowerCase();

  const priorityKey = (
    notice.importance || "medium").toLowerCase();

  const priority = priorityConfig[
    priorityKey as keyof typeof priorityConfig
  ] || {
    label: "Medium",
    variant: "info",
  };

  // CATEGORY

  const category =

    categoryConfig[
    (
      notice.category || "general"
    ) as keyof typeof categoryConfig
    ] || "General";

  // DATE

  const createdDate = notice.createdAt || notice.created_at || new Date();

  // IMAGE

  const imageUrl = notice.image_url;

  return (

    <Card
      variant="bordered"

      onClick={onClick}

      className={`
        cursor-pointer
        transition-all
        hover:border-primary-500
        hover:bg-dark-800/60

        ${!isRead && variant === "student"
          ? "border-l-4 border-l-primary-500"
          : ""
        }
      `}
    >

      {/* HEADER */}

      <div className="mb-3 flex items-start justify-between gap-4">

        <div className="min-w-0 flex-1">

          <div className="mb-2 flex flex-wrap items-center gap-2">

            <Badge
              variant={priority.variant as any}
            >
              {priority.label}
            </Badge>

            <Badge>
              {category}
            </Badge>

            {isStarred && (

              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            )}
          </div>

          <h3 className="truncate text-lg font-semibold text-white">

            {notice.title}

          </h3>
        </div>
      </div>

      {/* CONTENT */}

      <p className="mb-4 line-clamp-3 text-sm text-dark-300">

        {notice.description}

      </p>

      {/* IMAGE */}

      {imageUrl && (

        <div className="mb-4 overflow-hidden rounded-xl">

          <img
            src={imageUrl}
            alt={notice.title}
            className="max-h-[280px] w-full object-cover"
          />
        </div>
      )}

      {/* META */}

      <div className="mb-4 flex items-center gap-4 text-xs text-dark-400">

        <span className="flex items-center gap-1">

          <User className="h-3.5 w-3.5" />

          {
            notice.teacher_name ||
            notice.authorName ||
            "Teacher"
          }

        </span>

        <span className="flex items-center gap-1">

          <Clock className="h-3.5 w-3.5" />

          {formatDateTime(createdDate)}

        </span>
      </div>

      {/* ACTIONS */}

      <div
        className="flex items-center gap-2 border-t border-dark-700 pt-3"

        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* STUDENT */}

        {variant === "student" && (

          <>

            {!isRead && onMarkRead && (

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();

                  onMarkRead(notice.id);
                }}
              >

                <CheckCircle className="mr-1 h-4 w-4" />

                Read

              </Button>
            )}

            {onToggleStar && (

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(notice.id)
                }
                }
              >

                <Star
                  className={`
                    mr-1 h-4 w-4

                    ${isStarred
                      ? "fill-yellow-500 text-yellow-500"
                      : ""
                    }
                  `}
                />

                {isStarred
                  ? "Unstar"
                  : "Star"
                }

              </Button>
            )}

            {onHide && (

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();

                  onHide(notice.id);
                }}
              >

                <Trash2 className="mr-1 h-4 w-4" />

                Delete

              </Button>
            )}
          </>
        )}

        {/* TEACHER */}

        {variant === "teacher" && (

          <>

            {onEdit && (

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();

                  onEdit(notice);
                }}
              >

                <Pencil className="mr-1 h-4 w-4" />

                Edit

              </Button>
            )}

            {onDelete && (

              <Button
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();

                  onDelete(notice.id);
                }}
              >

                <Trash2 className="mr-1 h-4 w-4" />

                Delete

              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
}