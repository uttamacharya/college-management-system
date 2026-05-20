"use client";

import { useState } from "react";

import { useStudentMarks } from "@/hooks/useStudent";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";

import { Skeleton } from "@/components/ui/Skeleton";

import { Badge } from "@/components/ui/Badge";

export default function StudentMarksPage() {

  // =========================
  // STATES
  // =========================

  const [semester, setSemester] =
    useState("1");

  const [limit, setLimit] =
    useState(10);

  // =========================
  // API
  // =========================

  const {
    data,
    isLoading,
  } = useStudentMarks(semester);

  // =========================
  // DATA
  // =========================

  const allMarks =
    data?.data || [];

  const marks =
    allMarks.slice(0, limit);

  // =========================
  // SEMESTER SGPA
  // =========================

  const semesterSGPA =

    marks.length > 0

      ? (
          marks.reduce(
            (
              acc: number,
              item: any
            ) =>

              acc +
              Number(
                item.marks || 0
              ),

            0
          ) / marks.length
        ).toFixed(2)

      : "0.00";

  // =========================
  // CGPA
  // =========================

  const cgpa =
    semesterSGPA;

  // =========================
  // TOP SUBJECT
  // =========================

  const topSubject =

    marks.length > 0

      ? [...marks].sort(
          (a, b) =>

            Number(b.marks) -
            Number(a.marks)
        )[0]

      : null;

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-white">

            Academic Performance

          </h1>

          <p className="text-dark-400">

            View your semester wise academic performance

          </p>
        </div>

        {/* FILTERS */}

        <div className="flex gap-3">

          {/* SEMESTER */}

          <select
            value={semester}
            onChange={(e) =>
              setSemester(
                e.target.value
              )
            }
            className="rounded-lg border border-dark-700 bg-dark-800 px-4 py-2 text-sm text-white outline-none"
          >

            {Array.from({
              length: 8,
            }).map((_, index) => (

              <option
                key={index}
                value={index + 1}
              >

                Semester {index + 1}

              </option>
            ))}
          </select>

          {/* LIMIT */}

          <select
            value={limit}
            onChange={(e) =>
              setLimit(
                Number(
                  e.target.value
                )
              )
            }
            className="rounded-lg border border-dark-700 bg-dark-800 px-4 py-2 text-sm text-white outline-none"
          >

            {[1,2,3,4,5,6,7,8,9,10,20,50,100].map((num) => (

              <option
                key={num}
                value={num}
              >

                {num}

              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STATS */}

      <div className="grid gap-4 md:grid-cols-3">

        {/* SGPA */}

        <Card>

          <CardContent className="p-6">

            <p className="text-dark-400">

              Semester SGPA

            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">

              {semesterSGPA}

            </h2>

            <p className="mt-1 text-sm text-dark-400">

              Semester {semester}

            </p>

          </CardContent>

        </Card>

        {/* CGPA */}

        <Card>

          <CardContent className="p-6">

            <p className="text-dark-400">

              Overall CGPA

            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">

              {cgpa}

            </h2>

            <p className="mt-1 text-sm text-dark-400">

              Till current semester

            </p>

          </CardContent>

        </Card>

        {/* TOP SUBJECT */}

        <Card>

          <CardContent className="p-6">

            <p className="text-dark-400">

              Highest SGPA Subject

            </p>

            <h2 className="mt-2 text-xl font-bold text-white">

              {topSubject?.subject ||
                "N/A"}

            </h2>

            <p className="mt-1 text-sm text-dark-300">

              SGPA:
              {" "}
              {topSubject?.marks ||
                "0"}

              {" / "}

              {topSubject?.max_marks ||
                "10"}

            </p>

          </CardContent>

        </Card>
      </div>

      {/* TABLE */}

      <Card>

        <CardHeader>

          <CardTitle>

            Subject Performance

          </CardTitle>

        </CardHeader>

        <CardContent>

          {isLoading ? (

            <div className="space-y-4">

              {Array.from({
                length: 6,
              }).map((_, i) => (

                <Skeleton
                  key={i}
                  className="h-14 w-full"
                />
              ))}
            </div>

          ) : marks.length === 0 ? (

            <div className="py-10 text-center text-dark-400">

              No marks found

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-dark-700">

                    <th className="px-4 py-3 text-left text-sm font-medium text-dark-300">

                      Subject

                    </th>

                    <th className="px-4 py-3 text-left text-sm font-medium text-dark-300">

                      Semester

                    </th>

                    <th className="px-4 py-3 text-left text-sm font-medium text-dark-300">

                      SGPA

                    </th>

                    <th className="px-4 py-3 text-left text-sm font-medium text-dark-300">

                      Status

                    </th>

                  </tr>
                </thead>

                <tbody>

                  {marks.map(
                    (
                      item: any,
                      index: number
                    ) => {

                      const passed =
                        item.marks >= 4;

                      return (

                        <tr
                          key={index}
                          className="border-b border-dark-800 hover:bg-dark-800/40"
                        >

                          <td className="px-4 py-4 text-sm text-white">

                            {item.subject}

                          </td>

                          <td className="px-4 py-4 text-sm text-dark-300">

                            Semester {item.semester}

                          </td>

                          <td className="px-4 py-4 text-sm font-semibold text-white">

                            {item.marks}
                            {" / "}
                            {item.max_marks}

                          </td>

                          <td className="px-4 py-4">

                            <Badge
                              variant={
                                passed
                                  ? "success"
                                  : "danger"
                              }
                            >

                              {passed
                                ? "Pass"
                                : "Fail"}

                            </Badge>

                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}