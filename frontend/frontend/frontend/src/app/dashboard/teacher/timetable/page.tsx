"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
} from "lucide-react";

import { Input } from "@/components/ui/Input";

import { Button } from "@/components/ui/Button";

import {
  TimetableGrid,
} from "@/components/timetable/TimetableGrid";

import {
  TimetableFormModal,
} from "@/components/timetable/TimetableFormModal";

import {
  Timetable,
  CreateTimetableRequest,
} from "@/types/timetable.types";

import {

  useTeacherTimetable,

  useCreateTeacherTimetable,

  useUpdateTeacherTimetable,

} from "@/hooks/useTeacher";

export default function TeacherTimetablePage() {

  const [search, setSearch] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingTimetable, setEditingTimetable] =
    useState<Timetable | null>(null);

  // FETCH

  const {

    data: timetable = [],

    isLoading,

  } = useTeacherTimetable();

  console.log(
    "TIMETABLE PAGE =>",
    timetable
  );

  // MUTATIONS

  const createMutation =
    useCreateTeacherTimetable();

  const updateMutation =
    useUpdateTeacherTimetable();

  // FILTER

  const filteredTimetable =
    useMemo(() => {

      console.log(
        "FILTER INPUT =>",
        timetable
      );

      if (!Array.isArray(timetable)) {
        return [];
      }

      return timetable.filter(
        (item: Timetable) => {

          return (

            (item.subject || "")
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            (item.day || "")
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            (item.room || "")
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
          );
        }
      );

    }, [timetable, search]);

  // CREATE / UPDATE

  const handleCreateOrUpdate = (
    data: CreateTimetableRequest
  ) => {

    // UPDATE

    if (editingTimetable) {

      updateMutation.mutate(

        {
          id:
            editingTimetable.id,

          data,
        },

        {
          onSuccess: () => {

            setModalOpen(false);

            setEditingTimetable(null);
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
    timetable: Timetable
  ) => {

    setEditingTimetable(
      timetable
    );

    setModalOpen(true);
  };

  // CLOSE

  const handleCloseModal = () => {

    setModalOpen(false);

    setEditingTimetable(null);
  };

  console.log(
    "FILTERED TIMETABLE =>",
    filteredTimetable
  );

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-white">

            Teacher Timetable

          </h1>

          <p className="text-dark-400">

            Manage your class schedule

          </p>
        </div>

        <Button
          onClick={() =>
            setModalOpen(true)
          }
          className="w-full md:w-auto"
        >

          <Plus className="mr-2 h-4 w-4" />

          Add Class

        </Button>
      </div>

      {/* SEARCH */}

      <div className="w-full md:max-w-md">

        <Input
          placeholder="Search classes..."
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

      {/* GRID */}


      <TimetableGrid

        timetable={
          filteredTimetable
        }

        isLoading={isLoading}

        onEdit={handleEdit}
      />

      {/* MODAL */}

      <TimetableFormModal

        open={modalOpen}

        onClose={
          handleCloseModal
        }

        timetable={
          editingTimetable
        }

        onSubmit={
          handleCreateOrUpdate
        }

        isLoading={
          createMutation.isPending ||
          updateMutation.isPending
        }
      />
    </div>
  );
}
