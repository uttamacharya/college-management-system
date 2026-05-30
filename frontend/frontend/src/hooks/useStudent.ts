import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { studentApi } from "@/api/student.api";

import { noticeApi } from "@/api/notice.api";



// STUDENT PROFILE

export function useStudentProfile() {

  return useQuery({

    queryKey: [
      "student",
      "profile",
    ],

    queryFn: () =>
      studentApi.getProfile(),
  });
}


// STUDENT FULL PROFILE

export function useStudentFullProfile() {

  return useQuery({

    queryKey: [
      "student",
      "fullProfile",
    ],

    queryFn: () =>
      studentApi.getFullProfile(),
  });
}


// STUDENT MARKS

export function useStudentMarks(
  semester?: string
) {

  return useQuery({

    queryKey: [
      "student",
      "marks",
      semester,
    ],

    queryFn: () =>
      studentApi.getMarks(
        semester
      ),
  });
}


// STUDENT NOTICES

export function useStudentNotices(
  page ,
  limit 
) {

  return useQuery({

    queryKey: [
      "student",
      "notices",
      page,
      limit,
    ],

    queryFn: () =>
      noticeApi.getStudentNotices(
        page,
        limit
      ),
  });
}


// MARK NOTICE AS READ

export function useMarkNoticeAsRead() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: (
      noticeId: string
    ) =>
      noticeApi.markAsRead(
        noticeId
      ),

    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey: [
          "student",
          "notices",
        ],
      });
    },
  });
}


// TOGGLE NOTICE STAR

export function useToggleNoticeStar() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: (
      noticeId: string
    ) =>
      noticeApi.toggleStar(
        noticeId
      ),

    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey: [
          "student",
          "notices",
        ],
      });
    },
  });
}


// HIDE NOTICE

export function useHideNotice() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: (
      noticeId: string
    ) =>
      noticeApi.hideNotice(
        noticeId
      ),

    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey: [
          "student",
          "notices",
        ],
      });
    },
  });
}