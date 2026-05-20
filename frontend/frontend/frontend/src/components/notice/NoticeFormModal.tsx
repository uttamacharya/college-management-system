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

  onSubmit: (
    data: CreateNoticeRequest
  ) => void;

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

  const [category, setCategory] = useState<NoticeCategory>("general");

  const [importance, setImportance] = useState<NoticePriority>("medium");

  const [image, setImage] = useState<File | null>(null);

  const [targetBatches, setTargetBatches] = useState<number[]>([]);

  const [targetBranches, setTargetBranches] = useState<string[]>([]);

  const [studentIds, setStudentIds] = useState<string[]>([]);

  const [studentIdInput, setStudentIdInput] = useState("");

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // EDIT MODE

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
    }

  }, [notice]);

  // SUBMIT
  // from yaha se handle submit function ke andar data ko create ya update karne ke liye onSubmit function ko call karna hai, jisme CreateNoticeRequest type ka data pass karna hai. Ye data title, description, category, importance, image, targetBatches, targetBranches, aur target_student_ids ko include karega.
  const handleAddStudentId = () => {

    if (
      studentIdInput.trim()
      &&
      !studentIds.includes(
        studentIdInput.trim()
      )
    ) {

      setStudentIds([
        ...studentIds,
        studentIdInput.trim(),
      ]);

      setStudentIdInput("");
    }
  };

  const handleRemoveStudentId = (
    id: string
  ) => {

    setStudentIds(

      studentIds.filter(
        (item) => item !== id
      )
    );
  };

// 
  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const finalData = {

      title,

      description: content,

      category,

      importance,

      image,

      target_batches:
        targetBatches,

      target_branches:
        targetBranches,

      target_student_ids:
        studentIds,
    };

    // console.log(
    //   "FINAL FORM DATA =>",
    //   finalData
    // );

    onSubmit(finalData);
  };

  return (

    <Dialog
      open={open}
      onOpenChange={onClose}
    >

      <DialogContent className=" border-dark-700 bg-dark-900 text-white sm:max-w-2xl max-h-[90vh] overflow-y-auto "
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

          {/* CATEGORY */}

          <div>

            <label className="mb-2 block text-sm font-medium text-dark-200">

              Category

            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as NoticeCategory
                )
              }
              className="
                w-full rounded-lg
                border border-dark-600
                bg-dark-800
                px-4 py-3
                text-white
              "
            >

              <option value="general">
                General
              </option>

              <option value="academic">
                Academic
              </option>

              <option value="exam">
                Exam
              </option>

              <option value="event">
                Event
              </option>

              <option value="holiday">
                Holiday
              </option>

            </select>

          </div>

          {/* IMPORTANCE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-dark-200">

              Importance

            </label>

            <select
              value={importance}
              onChange={(e) =>
                setImportance(e.target.value as NoticePriority)
              }
              className="
                w-full rounded-lg
                border border-dark-600
                bg-dark-800
                px-4 py-3
                text-white
              "
            >

              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>

              <option value="urgent">
                Urgent
              </option>

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

                    .map((b) =>
                      Number(b.trim())
                    )

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

                    .map((b) =>
                      b.trim()
                    )

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
                  setStudentIdInput(
                    e.target.value
                  )
                }
              />

              <Button
                type="button"
                onClick={handleAddStudentId}
              >
                Add
              </Button>
            </div>

            {/* CHIPS */}

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
          </div>

          {/* IMAGE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-dark-200">

              Upload Image

            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file =
                  e.target.files?.[0] || null;

                setImage(file);

                if (file) {

                  setImagePreview(
                    URL.createObjectURL(file)
                  );
                }
              }}
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