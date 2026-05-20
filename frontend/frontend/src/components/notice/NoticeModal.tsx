"use client";

import {
  Notice,
} from "@/types/notice.types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

import { Badge } from "@/components/ui/Badge";

import { Button } from "@/components/ui/Button";

import { formatDateTime } from "@/lib/utils";

import {
  Star,
  Clock,
  User,
  CheckCircle,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

interface NoticeModalProps {

  open: boolean;

  onClose: () => void;

  notice: Notice | null;

  variant:
  | "student"
  | "teacher";

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

export function NoticeModal({

  open,

  onClose,

  notice,

  variant,

  onMarkRead,

  onToggleStar,

  onHide,

  onEdit,

  onDelete,

}: NoticeModalProps) {

  if (!notice) {
    return null;
  }

  const isRead =
    notice.isRead ||
    notice.is_read;

  const isStarred =
    notice.isStarred ||
    notice.is_starred;

  return (

    <Dialog
      open={open}
      onOpenChange={onClose}
    >

      <DialogContent className="max-h-[90vh] overflow-y-auto border-dark-700 bg-dark-900 text-white sm:max-w-3xl">

        {/* HEADER */}

        <DialogHeader>

          <div className="flex items-start justify-between gap-4">

            <div className="flex-1">

              <div className="mb-3 flex flex-wrap items-center gap-2">

                <Badge>

                  {notice.category}

                </Badge>

                <Badge variant="info">

                  {notice.priority}

                </Badge>

                {isStarred && (

                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                )}
              </div>

              <DialogTitle className="text-2xl font-bold text-white">

                {notice.title}

              </DialogTitle>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >

              <X className="h-5 w-5" />

            </Button>
          </div>
        </DialogHeader>

        {/* META */}

        <div className="flex flex-wrap items-center gap-4 text-sm text-dark-400">

          <span className="flex items-center gap-1">

            <User className="h-4 w-4" />

            {notice.authorName}

          </span>

          <span className="flex items-center gap-1">

            <Clock className="h-4 w-4" />

            {formatDateTime(
              notice.createdAt ||
              notice.created_at ||
              new Date()
            )}

          </span>
        </div>

        {/* IMAGE */}

        {notice.image && (

          <div className="overflow-hidden rounded-2xl border border-dark-700">

            <img
              src={notice.image}
              alt={notice.title}
              className="max-h-[450px] w-full object-cover"
            />
          </div>
        )}

        {/* CONTENT */}

        <div className="whitespace-pre-wrap leading-7 text-dark-200">

          {notice.content}

        </div>

        {/* ACTIONS */}

        <div className="flex flex-wrap items-center gap-3 border-t border-dark-700 pt-4">

          {/* STUDENT */}

          {variant === "student" && (

            <>
              {!isRead &&
                onMarkRead && (

                  <Button
                    variant="secondary"
                    onClick={() =>
                      onMarkRead(
                        notice.id
                      )
                    }
                  >

                    <CheckCircle className="mr-2 h-4 w-4" />

                    Mark Read

                  </Button>
                )}

              {onToggleStar && (

                <Button
                  variant="secondary"
                  onClick={() =>
                    onToggleStar(
                      notice.id
                    )
                  }
                >

                  <Star
                    className={`mr-2 h-4 w-4 ${isStarred

                        ? "fill-yellow-500 text-yellow-500"

                        : ""
                      }`}
                  />

                  {isStarred
                    ? "Unstar"
                    : "Star"}

                </Button>
              )}

              {onHide && (

                <Button
                  variant="danger"
                  onClick={() =>
                    onHide(
                      notice.id
                    )
                  }
                >

                  <Trash2 className="mr-2 h-4 w-4" />

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
                  variant="secondary"
                  onClick={() =>
                    onEdit(
                      notice
                    )
                  }
                >

                  <Pencil className="mr-2 h-4 w-4" />

                  Edit

                </Button>
              )}

              {onDelete && (

                <Button
                   variant="danger"
                  onClick={() =>
                    onDelete(
                      notice.id
                    )
                  }
                >

                  <Trash2 className="mr-2 h-4 w-4" />

                  Delete

                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

