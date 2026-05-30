"use client";

import {
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Users,
  MapPin,
  BookOpen,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/Card";

import { Skeleton } from "@/components/ui/Skeleton";

import { getInitials } from "@/lib/utils";

const streamMap: any = {

  "1": "CSE",
  "2": "IT",
  "3": "EEE",
  "4": "ETC",
  "5": "CE",
};

interface ProfileCardProps {

  profile: any;

  isLoading?: boolean;
}

export function ProfileCard({

  profile,
  isLoading,

}: ProfileCardProps) {

  // LOADING

  if (isLoading) {

    return (

      <Card>

        <CardContent className="space-y-4 p-6">

          <Skeleton className="h-24 w-24 rounded-full" />

          <Skeleton className="h-6 w-48" />

          <Skeleton className="h-4 w-full" />

          <Skeleton className="h-4 w-3/4" />

        </CardContent>

      </Card>
    );
  }

  // PROFILE DATA

  const student =

    profile?.data ||

    profile ||

    {};

  const collegeId =

    student?.college_id ||

    student?.collegeId ||

    student?.email?.split("@")[0] ||

    "N/A";

  const fullName =

    student?.name ||

    student?.full_name ||

    "Student";

  const email =

    student?.email ||

    "N/A";

  const subjects =

    student?.subjects ||

    [];

  // STREAM

  const streamCode =
    collegeId?.charAt(1);

  const stream =

    streamMap[streamCode] ||

    "N/A";

  // ROLL NUMBER

  const rollNumber =

    collegeId !== "N/A"

      ? collegeId.slice(-3)

      : "N/A";

  // ADMISSION YEAR

  const admissionYear =

    collegeId !== "N/A"

      ? `20${collegeId.slice(2, 4)}`

      : "N/A";

  // LATEST SEMESTER

  const latestSemester =

    subjects.length > 0

      ? Math.max(
          ...subjects.map(
            (s: any) =>
              Number(s.semester)
          )
        )

      : "N/A";

  return (

    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

      {/* LEFT SIDE */}

      <Card>

        <CardContent className="p-6">

          <div className="flex flex-col items-center text-center">

            {/* AVATAR */}

            <div
              className="
                flex
                h-28
                w-28
                items-center
                justify-center
                rounded-full
                bg-primary-600
                text-4xl
                font-bold
                text-white
              "
            >

              {getInitials(fullName)}

            </div>

            {/* NAME */}

            <h2 className="mt-4 text-2xl font-bold text-white">

              {fullName}

            </h2>

            {/* COLLEGE ID */}

            <p className="mt-1 text-dark-400">

              College ID:
              {" "}
              {collegeId}

            </p>

            {/* ROLL NUMBER */}

            <p className="text-dark-400">

              Roll No:
              {" "}
              {rollNumber}

            </p>

          </div>

          {/* INFO */}

          <div className="mt-6 space-y-4">

            {/* EMAIL */}

            <div className="flex items-center gap-3 rounded-xl bg-dark-800 p-4">

              <Mail className="h-5 w-5 text-primary-400" />

              <div>

                <p className="text-sm text-dark-400">

                  Email

                </p>

                <p className="text-white">

                  {email}

                </p>

              </div>

            </div>

            {/* PHONE */}

            <div className="flex items-center gap-3 rounded-xl bg-dark-800 p-4">

              <Phone className="h-5 w-5 text-primary-400" />

              <div>

                <p className="text-sm text-dark-400">

                  Phone

                </p>

                <p className="text-white">

                  Not provided

                </p>

              </div>

            </div>

            {/* STREAM */}

            <div className="flex items-center gap-3 rounded-xl bg-dark-800 p-4">

              <GraduationCap className="h-5 w-5 text-primary-400" />

              <div>

                <p className="text-sm text-dark-400">

                  Stream

                </p>

                <p className="text-white">

                  {stream}

                </p>

              </div>

            </div>

            {/* SEMESTER */}

            {student?.role !== "teacher" && (

              <div className="flex items-center gap-3 rounded-xl bg-dark-800 p-4">

                <Calendar className="h-5 w-5 text-primary-400" />

                <div>

                  <p className="text-sm text-dark-400">

                    Semester

                  </p>

                  <p className="text-white">

                    Semester {latestSemester}

                  </p>

                </div>

              </div>
            )}

            {/* ADMISSION YEAR */}

            <div className="flex items-center gap-3 rounded-xl bg-dark-800 p-4">

              <Users className="h-5 w-5 text-primary-400" />

              <div>

                <p className="text-sm text-dark-400">

                  Admission Year

                </p>

                <p className="text-white">

                  {admissionYear}

                </p>

              </div>

            </div>

            {/* ADDRESS */}

            <div className="flex items-center gap-3 rounded-xl bg-dark-800 p-4">

              <MapPin className="h-5 w-5 text-primary-400" />

              <div>

                <p className="text-sm text-dark-400">

                  Address

                </p>

                <p className="text-white">

                  Bhubaneswar, Odisha

                </p>

              </div>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* RIGHT SIDE */}

      <div className="space-y-6">

        {/* PERSONAL INFO */}

        <Card>

          <CardContent className="p-6">

            <h3 className="text-2xl font-bold text-white">

              Personal Information

            </h3>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {/* FULL NAME */}

              <div>

                <p className="text-dark-400">

                  Full Name

                </p>

                <p className="mt-1 text-lg text-white">

                  {fullName}

                </p>

              </div>

              {/* EMAIL */}

              <div>

                <p className="text-dark-400">

                  Email Address

                </p>

                <p className="mt-1 text-lg text-white">

                  {email}

                </p>

              </div>

              {/* STREAM */}

              <div>

                <p className="text-dark-400">

                  Stream

                </p>

                <p className="mt-1 text-lg text-white">

                  {stream}

                </p>

              </div>

              {/* TOTAL SUBJECTS */}

              <div>

                <p className="text-dark-400">

                  Total Subjects

                </p>

                <p className="mt-1 text-lg text-white">

                  {subjects.length}

                </p>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* SUBJECTS */}

        {/* <Card>

          <CardContent className="p-6">

            <div className="flex items-center gap-2">

              <BookOpen className="h-6 w-6 text-primary-400" />

              <h3 className="text-2xl font-bold text-white">

                Registered Subjects

              </h3>

            </div>

            <div className="mt-6">

              {subjects.length > 0 ? (

                <div className="grid gap-3 sm:grid-cols-2">

                  {subjects.map(
                    (
                      subject: any,
                      index: number
                    ) => (

                      <div
                        key={index}
                        className="rounded-xl border border-dark-700 bg-dark-800 p-4"
                      >

                        <p className="font-semibold text-white">

                          {subject.subject}

                        </p>

                        <p className="mt-1 text-sm text-dark-400">

                          Semester {subject.semester}

                        </p>

                        <p className="mt-2 text-sm text-primary-400">

                          SGPA:
                          {" "}
                          {subject.marks}

                        </p>

                      </div>
                    )
                  )}

                </div>

              ) : (

                <p className="text-dark-400">

                  No subjects found

                </p>
              )}

            </div>

          </CardContent> */}

        {/* </Card> */}

      </div>

    </div>
  );
}