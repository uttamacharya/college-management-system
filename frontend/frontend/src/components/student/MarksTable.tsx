"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";

import { Skeleton } from "@/components/ui/Skeleton";

import { Badge } from "@/components/ui/Badge";

interface MarksTableProps {

  marks: any[];

  isLoading?: boolean;
}

export function MarksTable({
  marks,
  isLoading,
}: MarksTableProps) {

  return (

    <Card>

      <CardHeader>

        <CardTitle>

          Latest Semester Performance

        </CardTitle>

      </CardHeader>

      <CardContent>

        {isLoading ? (

          <div className="space-y-4">

            {Array.from({
              length: 5,
            }).map((_, i) => (

              <Skeleton
                key={i}
                className="h-14 w-full"
              />
            ))}

          </div>

        ) : marks.length === 0 ? (

          <div className="py-10 text-center text-dark-400">

            No performance data available

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

                    const sgpa =
                      Number(
                        item.marks || 0
                      );

                    const passed =
                      sgpa >= 4;

                    return (

                      <tr
                        key={index}
                        className="border-b border-dark-800 hover:bg-dark-800/40"
                      >

                        {/* SUBJECT */}

                        <td className="px-4 py-4 text-sm text-white">

                          {item.subject || "N/A"}

                        </td>

                        {/* SEMESTER */}

                        <td className="px-4 py-4 text-sm text-dark-300">

                          Semester {item.semester || "N/A"}

                        </td>

                        {/* SGPA */}

                        <td className="px-4 py-4 text-sm font-semibold text-white">

                          {sgpa.toFixed(2)}

                        </td>

                        {/* STATUS */}

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
  );
}