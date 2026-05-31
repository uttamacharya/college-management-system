"use client";

import { useState } from "react";

import {
  useTeacherNotices,
  useCreateNotice,
  useUpdateNotice,
  useDeleteNotice,
} from "@/hooks/useTeacher";

import { NoticeGrid } from "@/components/notice/NoticeGrid";
import { NoticeFormModal } from "@/components/notice/NoticeFormModal";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import {
  Notice,
} from "@/types/notice.types";

import {
  Plus,
  Search,
} from "lucide-react";

export default function TeacherNoticesPage() {

  // STATES

  const [search, setSearch] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingNotice, setEditingNotice] =
    useState<Notice | null>(null);

  const [selectedNotice, setSelectedNotice] =
    useState<Notice | null>(null);

  // API HOOKS

  const {
    data,
    isLoading,
  } = useTeacherNotices(1, 10);

  const notices = data || [];

  // console.log("API DATA =>", data);

  // console.log("NOTICES =>", notices);

  const createMutation =
    useCreateNotice();

  const updateMutation =
    useUpdateNotice();

  const deleteMutation =
    useDeleteNotice();

  // FILTER

  const filteredNotices =
    notices.filter((notice: Notice) => {
      {

        const query =
          search.toLowerCase();

        return (

          notice.title
            ?.toLowerCase()
            .includes(query)

          ||

          notice.description
            ?.toLowerCase()
            .includes(query)

          ||

          notice.category
            ?.toLowerCase()
            .includes(query)

          ||

          notice.importance
            ?.toLowerCase()
            .includes(query)
        );
      }
    });

  // CREATE / UPDATE

const handleCreateOrUpdate = (
  data: FormData
) => {

  // UPDATE

  if (editingNotice) {

    updateMutation.mutate(

      {
        noticeId:
          editingNotice.id,

        data,
      },

      {
        onSuccess: () => {

          setModalOpen(false);

          setEditingNotice(null);
        },
      }
    );

    return;
  }

  // CREATE

  createMutation.mutate(

    data,

    {
      onSuccess: () => {

        setModalOpen(false);
      },
    }
  );
};

  // EDIT

  const handleEdit = (
    notice: Notice
  ) => {

    setEditingNotice(notice);

    setModalOpen(true);
  };

  // DELETE

  const handleDelete = (
    id: string
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this notice?"
      );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(id);
  };

  // CLOSE MODAL

  const handleCloseModal = () => {

    setModalOpen(false);

    setEditingNotice(null);
  };

  // RENDER

  return (

    <div className="space-y-6">

      {/* 
          HEADER
    */}

      <div
        className="
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div>

          <h1 className="text-2xl font-bold text-white">

            Manage Notices

          </h1>

          <p className="text-dark-400">

            Create and manage your announcements

          </p>
        </div>

        {/* CREATE BUTTON */}

        <Button
          onClick={() => {

            setEditingNotice(null);

            setModalOpen(true);
          }}

          className="
            flex
            w-full
            items-center
            justify-center
            md:w-auto
          "
        >

          <Plus className="mr-2 h-4 w-4" />

          Create Notice

        </Button>
      </div>

      {/* 
          SEARCH
    */}

      <div className="w-full md:max-w-md">

        <Input
          placeholder="Search your notices..."

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

          icon={
            <Search className="h-5 w-5" />
          }
        />
      </div>

      {/* 
          NOTICE GRID
    */}

      <NoticeGrid

        notices={filteredNotices}

        variant="teacher"

        isLoading={isLoading}

        onCardClick={(notice) =>
          setSelectedNotice(notice)
        }

        onEdit={handleEdit}

        onDelete={handleDelete}
      />

      {/*
          CREATE / EDIT MODAL
    */}

      <NoticeFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        notice={editingNotice}
        onSubmit={handleCreateOrUpdate}
        isLoading={
          createMutation.isPending ||
          updateMutation.isPending
        }
      />

      {/* 
          PREVIEW MODAL
    */}

      {selectedNotice && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            p-4
          "

          onClick={() =>
            setSelectedNotice(null)
          }
        >

          <div
            className="
              w-full
              max-w-2xl
              rounded-2xl
              bg-dark-900
              p-6
            "

            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* TITLE */}

            <div className="mb-4 flex items-start justify-between gap-4">

              <div>

                <h2 className="text-2xl font-bold text-white">

                  {selectedNotice.title}

                </h2>

                <p className="mt-1 text-sm text-dark-400">

                  {selectedNotice.importance}
                </p>
              </div>

              <Button
                variant="ghost"

                onClick={() =>
                  setSelectedNotice(null)
                }
              >
                Close
              </Button>
            </div>

            {/* IMAGE */}

            {selectedNotice.image_url && (

              <img
                src={
                  selectedNotice.image_url
                }

                alt={
                  selectedNotice.title
                }

                className="
                  mb-4
                  max-h-[400px]
                  w-full
                  rounded-xl
                  object-cover
                "
              />
            )}

            {/* DESCRIPTION */}

            <p
              className="
                whitespace-pre-wrap
                text-dark-200
              "
            >

              {selectedNotice.description}

            </p>
          </div>
        </div>
      )}
    </div>
  );
}