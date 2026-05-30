"use client";

import { useState } from "react";

import {
  useStudentNotices,
  useMarkNoticeAsRead,
  useToggleNoticeStar,
  useHideNotice,
} from "@/hooks/useStudent";

import { NoticeGrid } from "@/components/notice/NoticeGrid";

import { NoticeModal } from "@/components/notice/NoticeModal";

import { Input } from "@/components/ui/Input";

import { Button } from "@/components/ui/Button";

import {
  Search,
  Filter,
  Star,
  CheckCircle,
} from "lucide-react";
import { mapNotice } from "@/lib/notice.mapper";

type FilterType =
  | "all"
  | "unread"
  | "starred";

export default function StudentNoticesPage() {

  // =========================
  // STATES
  // =========================

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<FilterType>("all");

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const [
    selectedNotice,
    setSelectedNotice,
  ] = useState<any>(null);

  // =========================
  // API CALLS
  // =========================

  const {
    data: noticesResponse,
    isLoading,
  } = useStudentNotices(
    page,
    limit
  );

  const markReadMutation =
    useMarkNoticeAsRead();

  const toggleStarMutation =
    useToggleNoticeStar();

  const hideMutation =
    useHideNotice();

  // =========================
  // DATA
  // =========================

  const notices =
    noticesResponse?.notices?.map(
      mapNotice
    ) || [];
  // =========================
  // FILTERED NOTICES
  // =========================

  const filteredNotices =
    notices.filter(
      (notice: any) => {

        const matchesSearch =

          notice.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          notice.content
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        // UNREAD

        if (
          filter === "unread"
        ) {

          return (
            matchesSearch &&
            !(
              notice.isRead ||
              notice.is_read
            )
          );
        }

        // STARRED

        if (
          filter === "starred"
        ) {

          return (
            matchesSearch &&
            (
              notice.isStarred ||
              notice.is_starred
            )
          );
        }

        // ALL

        return matchesSearch;
      }
    );

  // =========================
  // RETURN
  // =========================

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div>

        <h1 className="text-2xl font-bold text-white">

          Notices

        </h1>

        <p className="text-dark-400">

          Stay updated with the latest announcements

        </p>
      </div>

      {/* FILTERS */}

      <div className="flex flex-col gap-4 sm:flex-row">

        {/* SEARCH */}

        <div className="flex-1">

          <Input
            placeholder="Search notices..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            icon={
              <Search className="h-5 w-5" />
            }
          />
        </div>

        {/* FILTER BUTTONS */}

        <div className="flex items-center gap-2">

          <span className="text-sm text-dark-300">

            Show

          </span>

          <select
            value={limit}

            onChange={(e) => {

              setLimit(
                Number(e.target.value)
              );

              setPage(1);
            }}

            className="
                rounded-lg
                border
                border-dark-700
                bg-dark-800
                px-3
                py-2
                text-sm
                text-white
                outline-none
              "
          >

            <option value={1}>
              1
            </option>

            <option value={2}>
              2
            </option>

            <option value={3}>
              3
            </option>

            <option value={4}>
              4
            </option>

            <option value={5}>
              5
            </option>

            <option value={6}>
              6
            </option>

            <option value={7}>
              7
            </option>

            <option value={8}>
              8
            </option>

            <option value={9}>
              9
            </option>

            <option value={10}>
              10
            </option>

            <option value={20}>
              20
            </option>

            <option value={50}>
              50
            </option>

            <option value={100}>
              100
            </option>

          </select>

          <span className="text-sm text-dark-300">

            per page

          </span>
        </div>

        <div className="flex gap-2">

          {/* ALL */}

          <Button
            variant={
              filter === "all"
                ? "primary"
                : "outline"
            }
            size="sm"
            onClick={() =>
              setFilter("all")
            }
          >

            <Filter className="mr-1 h-4 w-4" />

            All

          </Button>

          {/* UNREAD */}

          <Button
            variant={
              filter === "unread"
                ? "primary"
                : "outline"
            }
            size="sm"
            onClick={() =>
              setFilter("unread")
            }
          >

            <CheckCircle className="mr-1 h-4 w-4" />

            Unread

          </Button>

          {/* STARRED */}

          <Button
            variant={
              filter === "starred"
                ? "primary"
                : "outline"
            }
            size="sm"
            onClick={() =>
              setFilter("starred")
            }
          >

            <Star className="mr-1 h-4 w-4" />

            Starred

          </Button>
        </div>
      </div>

      {/* NOTICE GRID */}

      <NoticeGrid
        notices={filteredNotices}

        variant="student"

        isLoading={isLoading}

        onCardClick={(notice: any) =>
          setSelectedNotice(notice)
        }

        onMarkRead={(id) =>
          markReadMutation.mutate(id)
        }

        onToggleStar={(id) =>
          toggleStarMutation.mutate(id)
        }

        onHide={(id) =>
          hideMutation.mutate(id)
        }
      />

      <div className="flex items-center justify-center gap-3">

        <Button
          variant="outline"

          disabled={page === 1}

          onClick={() =>
            setPage((prev) =>
              prev - 1
            )
          }
        >

          Previous

        </Button>

        <span className="text-sm text-dark-300">

          Page {page}

        </span>

        <Button
          variant="outline"

          disabled={
            notices.length < limit
          }

          onClick={() =>
            setPage((prev) =>
              prev + 1
            )
          }
        >

          Next

        </Button>
      </div>

      {/* NOTICE MODAL */}

      {selectedNotice && (

        <NoticeModal
          notice={selectedNotice}

          open={!!selectedNotice}

          onClose={() =>
            setSelectedNotice(null)
          }

          variant="student"

          onMarkRead={(id) =>
            markReadMutation.mutate(id)
          }

          onToggleStar={(id) =>
            toggleStarMutation.mutate(id)
          }

          onHide={(id) =>
            hideMutation.mutate(id)
          }
        />
      )}
    </div>
  );
}