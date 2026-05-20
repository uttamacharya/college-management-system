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

  createNotice: async (
    data: any
  ) => {

    // IMAGE CASE

    // if (data.image) {

    //   const formData =
    //     new FormData();

    //   formData.append(
    //     "title",
    //     data.title
    //   );

    //   formData.append(
    //     "description",
    //     data.description || ""
    //   );

    //   formData.append(
    //     "importance",
    //     data.importance || ""
    //   );

    //   formData.append(
    //     "category",
    //     data.category || ""
    //   );

    //   formData.append(
    //     "image",
    //     data.image
    //   );

    //   // formData.append(
    //   //   "target_batches",
    //   //   JSON.stringify(
    //   //     data.target_batches || []
    //   //   )
    //   // );

    //   data.target_batches?.forEach(
    //     (batch: string) => {

    //       formData.append(
    //         "target_batches",
    //         batch
    //       );
    //     }
    //   );

    //   // formData.append(
    //   //   "target_branches",
    //   //   JSON.stringify(
    //   //     data.target_branches || []
    //   //   )
    //   // );

    //   data.target_branches?.forEach(
    //     (branch: string) => {

    //       formData.append(
    //         "target_branches",
    //         branch
    //       );
    //     }
    //   );

    //   // formData.append(
    //   //   "target_student_ids",
    //   //   JSON.stringify(
    //   //     data.target_student_ids || []
    //   //   )
    //   // );

    //   data.target_student_ids?.forEach(
    //     (id: string) => {

    //       formData.append(
    //         "target_student_ids",
    //         id
    //       );
    //     }
    //   );

    //   const response =
    //     await noticeClient.post(
    //       "/notice/create",
    //       formData,
    //       {
    //         headers: {
    //           "Content-Type":
    //             "multipart/form-data",
    //         },
    //       }
    //     );

    //   return response.data;
    // }

    if (data.image) {

      const formData =
        new FormData();

      formData.append(
        "title",
        data.title
      );

      formData.append(
        "description",
        data.description || ""
      );

      formData.append(
        "importance",
        data.importance || ""
      );

      formData.append(
        "category",
        data.category || ""
      );

      // IMAGE

      formData.append(
        "image",
        data.image
      );

      // ARRAYS

      data.target_batches?.forEach(
        (batch: string) => {

          formData.append(
            "target_batches",
            batch
          );
        }
      );

      data.target_branches?.forEach(
        (branch: string) => {

          formData.append(
            "target_branches",
            branch
          );
        }
      );

      data.target_student_ids?.forEach(
        (id: string) => {

          formData.append(
            "target_student_ids",
            id
          );
        }
      );

      const response =
        await noticeClient.post(
          "/notice/create",
          formData
        );

      return response.data;
    }

    // NORMAL JSON CASE

    const response =
      await noticeClient.post(
        "/notice/create",
        {
          title: data.title,
          description:
            data.description,

          importance:
            data.importance,

          category:
            data.category,

          target_batches:
            data.target_batches,

          target_branches:
            data.target_branches,

          target_student_ids:
            data.target_student_ids,
        }
      );

    return response.data;
  },



  // UPDATE NOTICE

  updateNotice: async (
    noticeId: string,
    data: CreateNoticeRequest
  ) => {

    const response =
      await noticeClient.patch(
        `/notice/update/${noticeId}`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
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