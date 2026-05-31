"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

import { Button } from "@/components/ui/Button";

import { Input } from "@/components/ui/Input";

import {
  Notice,
  CreateNoticeRequest,
  NoticeCategory,
  NoticePriority,
} from "@/types/notice.types";

interface NoticeFormModalProps {
  open: boolean;
  onClose: () => void;
  notice?: Notice | null;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function NoticeFormModal({
  open,
  onClose,
  notice,
  onSubmit,
  isLoading,
}: NoticeFormModalProps) {

  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const [category, setCategory] =
    useState<NoticeCategory>("general");

  const [importance, setImportance] =
    useState<NoticePriority>("medium");

  const [image, setImage] =
    useState<File | null>(null);

  const [targetBatches, setTargetBatches] =
    useState<number[]>([]);

  const [targetBranches, setTargetBranches] =
    useState<string[]>([]);

  const [studentIds, setStudentIds] =
    useState<string[]>([]);

  const [studentIdInput, setStudentIdInput] =
    useState("");

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [removeImage, setRemoveImage] =
    useState(false);

  // ─── Reset State On Close ─────────

  useEffect(() => {

    if (!open) {

      setTitle("");
      setContent("");
      setCategory("general");
      setImportance("medium");
      setImage(null);
      setImagePreview(null);
      setTargetBatches([]);
      setTargetBranches([]);
      setStudentIds([]);
      setStudentIdInput("");
      setRemoveImage(false);
    }

  }, [open]);

  // ─── Edit Mode — Prefill ──────────

  useEffect(() => {

    if (notice) {

      setTitle(notice.title || "");

      setContent(
        notice.content ||
        notice.description ||
        ""
      );

      setCategory(
        notice.category || "general"
      );

      setImportance(
        notice.importance || "medium"
      );

      setTargetBatches(
        notice.target_batches || []
      );

      setTargetBranches(
        notice.target_branches || []
      );

      setStudentIds(
        notice.target_student_ids || []
      );

      setImagePreview(
        notice.image_url || null
      );
    }

  }, [notice]);

  // ─── Add Student ID ───────────────

  const handleAddStudentId = () => {

    const trimmed =
      studentIdInput.trim();

    if (
      trimmed &&
      !studentIds.includes(trimmed)
    ) {

      setStudentIds([
        ...studentIds,
        trimmed,
      ]);

      setStudentIdInput("");
    }
  };

  // ─── Remove Student ID ────────────

  const handleRemoveStudentId = (
    id: string
  ) => {

    setStudentIds(
      studentIds.filter(
        (item) => item !== id
      )
    );
  };

  // ─── Submit ───────────────────────

  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);

    formData.append("description", content);

    formData.append("importance", importance);

    if (targetBatches.length > 0) {
      formData.append(
        "target_batches",
        JSON.stringify(targetBatches)
      );
    }

    if (targetBranches.length > 0) {
      formData.append(
        "target_branches",
        JSON.stringify(targetBranches)
      );
    }

    if (studentIds.length > 0) {
      formData.append(
        "target_student_ids",
        JSON.stringify(studentIds)
      );
    }

    if (image) {
      formData.append("image", image);
    }

    // Edit mode mein image remove karna ho
    if (removeImage) {
      formData.append("remove_image", "true");
    }

    onSubmit(formData);
  };

  // ─── Render ───────────────────────

  return (

    <Dialog
      open={open}
      onOpenChange={onClose}
    >

      <DialogContent
        className="
          border-dark-700
          bg-dark-900
          text-white
          sm:max-w-2xl
          max-h-[90vh]
          overflow-y-auto
        "
      >

        <DialogHeader>

          <DialogTitle>

            {notice
              ? "Edit Notice"
              : "Create Notice"}

          </DialogTitle>

        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* TITLE */}

          <Input
            label="Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Enter title"
            required
          />

          {/* CONTENT */}

          <div>

            <label className="mb-2 block text-sm font-medium text-dark-200">
              Content
            </label>

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Write notice content..."
              rows={5}
              className="
                w-full rounded-lg
                border border-dark-600
                bg-dark-800
                px-4 py-3
                text-white
                outline-none
                focus:border-primary-500
              "
              required
            />

          </div>

          {/* IMPORTANCE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-dark-200">
              Importance
            </label>

            <select
              value={importance}
              onChange={(e) =>
                setImportance(
                  e.target.value as NoticePriority
                )
              }
              aria-label="Importance" 
              className="
                w-full rounded-lg
                border border-dark-600
                bg-dark-800
                px-4 py-3
                text-white
              "
            >

              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>

            </select>

          </div>

          {/* TARGET BATCHES */}

          <div>

            <label className="mb-2 block text-sm font-medium text-dark-200">
              Target Batches
            </label>

            <Input
              placeholder="2021,2022"
              value={targetBatches.join(",")}
              onChange={(e) =>
                setTargetBatches(
                  e.target.value
                    .split(",")
                    .map((b) => Number(b.trim()))
                    .filter(Boolean)
                )
              }
            />

          </div>

          {/* TARGET BRANCHES */}

          <div>

            <label className="mb-2 block text-sm font-medium text-dark-200">
              Target Branches
            </label>

            <Input
              placeholder="CSE,ECE"
              value={targetBranches.join(",")}
              onChange={(e) =>
                setTargetBranches(
                  e.target.value
                    .split(",")
                    .map((b) => b.trim())
                    .filter(Boolean)
                )
              }
            />

          </div>

          {/* STUDENT IDS */}

          <div>

            <label className="mb-2 block text-sm font-medium text-dark-200">
              Student IDs
            </label>

            <div className="flex gap-2">

              <Input
                placeholder="Enter student ID"
                value={studentIdInput}
                onChange={(e) =>
                  setStudentIdInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddStudentId();
                  }
                }}
              />

              <Button
                type="button"
                onClick={handleAddStudentId}
              >
                Add
              </Button>

            </div>

            {/* CHIPS */}

            {studentIds.length > 0 && (

              <div className="mt-3 flex flex-wrap gap-2">

                {studentIds.map((id) => (

                  <div
                    key={id}
                    className="
                      flex items-center gap-2
                      rounded-full
                      bg-primary-600
                      px-3 py-1
                      text-sm text-white
                    "
                  >

                    {id}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveStudentId(id)
                      }
                    >
                      ✕
                    </button>

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* IMAGE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-dark-200">
              Upload Image
            </label>

            {/* Existing Image Preview */}

            {imagePreview && !removeImage && (

              <div className="mb-3">

                <img
                  src={imagePreview}
                  alt="Preview"
                  className="
                    mb-2
                    max-h-[200px]
                    w-full
                    rounded-xl
                    object-cover
                  "
                />

                {/* Edit mode mein remove button */}

                {notice?.image_url && (

                  <button
                    type="button"
                    onClick={() => {
                      setRemoveImage(true);
                      setImagePreview(null);
                    }}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove Image
                  </button>
                )}

              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {

                const file =
                  e.target.files?.[0] || null;

                setImage(file);
                setRemoveImage(false);

                if (file) {
                  setImagePreview(
                    URL.createObjectURL(file)
                  );
                }
              }}
              aria-label="Importance" 
              className="text-sm text-dark-300"
            />

          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3">

            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
            >

              {isLoading
                ? "Saving..."
                : notice
                  ? "Update Notice"
                  : "Create Notice"}

            </Button>

          </div>

        </form>

      </DialogContent>

    </Dialog>
  );
}