"use client";

import { useStudentFullProfile } from "@/hooks/useStudent";
import { ProfileCard } from "@/components/student/ProfileCard";

export default function StudentProfilePage() {

  const {
    data: profile,
    isLoading,
  } = useStudentFullProfile();

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-2xl font-bold text-white">
          My Profile
        </h1>

        <p className="text-dark-400">
          View and manage your personal information
        </p>

      </div>

      <ProfileCard
        profile={profile}
        isLoading={isLoading}
      />

    </div>
  );
}