import { userClient } from "@/lib/axios";

export const studentApi = {

  // PROFILE

  getProfile: async () => {

    const response =
      await userClient.get(
        "/student/profile"
      );

    return response.data;
  },

  // FULL PROFILE

  getFullProfile: async () => {

    const response =
      await userClient.get(
        "/student/full-profile"
      );

    return response.data;
  },

  // MARKS

  getMarks: async (
    semester?: string
  ) => {

    const response =
      await userClient.get(

        semester
          ? `/student/marks?semester=${semester}`
          : "/student/marks"
      );

    return response.data;
  },
};