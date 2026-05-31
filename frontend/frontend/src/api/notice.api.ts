import { noticeClient } from "@/lib/axios";
import { CreateNoticeRequest } from "@/types/notice.types";

export const noticeApi = {

  // STUDENT NOTICES

  getStudentNotices: async (
    page = 1,
    limit = 100
  ) => {

    const response =
      await noticeClient.get(
        `/notice/student?page=${page}&limit=${limit}`
      );

    return response.data;
  },



  // MARK AS READ

  markAsRead: async (
    noticeId: string
  ) => {

    const response =
      await noticeClient.post(
        `/notice/read/${noticeId}`
      );

    return response.data;
  },



  // TOGGLE STAR

  toggleStar: async (
    noticeId: string
  ) => {

    const response =
      await noticeClient.post(
        `/notice/star/${noticeId}`
      );

    return response.data;
  },



  // HIDE NOTICE

  hideNotice: async (
    noticeId: string
  ) => {

    const response =
      await noticeClient.patch(
        `/notice/hide/${noticeId}`
      );

    return response.data;
  },



  // GET TEACHER NOTICES

  getTeacherNotices: async (
    page = 1,
    limit = 100
  ) => {

    const response =
      await noticeClient.get(
        `/notice/teacher?page=${page}&limit=${limit}`
      );

    return response.data;
  },


  // CREATE NOTICE

  // CREATE NOTICE
  createNotice: async (formData: FormData) => {
    const response = await noticeClient.post(
      "/notice/create",
      formData
    );
    return response.data;
  },

  // UPDATE NOTICE

  // UPDATE NOTICE
  updateNotice: async (
    noticeId: string,
    formData: FormData
  ) => {
    const response = await noticeClient.patch(
      `/notice/update/${noticeId}`,
      formData
    );
    return response.data;
  },



  // DELETE NOTICE

  deleteNotice: async (
    noticeId: string
  ) => {
    // console.log("DELETE ID =>", noticeId);
    const response =
      await noticeClient.delete(
        `/notice/delete/${noticeId}`
      );

    return response.data;
  },
};