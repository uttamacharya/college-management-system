"use client";

import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { noticeApi } from "@/api/notice.api";

import {
    createTeacherTimetable,
    getTeacherTimetable,
    updateTeacherTimetable,
} from "@/api/teacher.api";
import { CreateNoticeRequest } from "@/types/notice.types";



// GET TEACHER NOTICES

export const useTeacherNotices = (
    page = 1,
    limit = 10
) => {

    return useQuery({

        queryKey: [
            "teacher-notices",
            page,
            limit,
        ],

        queryFn: async () => {

            const response =
                await noticeApi.getTeacherNotices(
                    page,
                    limit
                );

            return response.notices;
        },
        staleTime: 0,

        refetchOnWindowFocus: true,

        refetchOnMount: true,
    });
};


// CREATE NOTICE

export const useCreateNotice = () => {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: async (
            formData: FormData
        ) => {

            const response =
                await noticeApi.createNotice(
                    formData
                );

            return response.notices;
        },

        onSuccess: () => {

            // Teacher notices refresh

            queryClient.invalidateQueries({

                queryKey: [
                    "teacher-notices",
                ],
            });

            // Student notices refresh

            queryClient.invalidateQueries({

                queryKey: [
                    "student-notices",
                ],
            });
        },
    });
};


// UPDATE NOTICE

export const useUpdateNotice = () => {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: async ({
            noticeId,
            data,
        }: {
            noticeId: string;
            data: FormData
        }) => {

            return await noticeApi.updateNotice(
                noticeId,
                data
            );
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["teacher-notices"],
            });

            // 
            queryClient.invalidateQueries({
                queryKey: ["student-notices"],
            });
        },
    });
};



// DELETE NOTICE

export const useDeleteNotice = () => {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: async (
            noticeId: string
        ) => {

            return await noticeApi.deleteNotice(
                noticeId
            );
        },

        onMutate: async (
            noticeId: string
        ) => {

            // STOP OLD FETCHES

            await queryClient.cancelQueries({

                queryKey: [
                    "teacher-notices",
                ],
            });

            // PREVIOUS CACHE

            const previousNotices =
                queryClient.getQueryData([
                    "teacher-notices",
                    1,
                    10,
                ]);

            // OPTIMISTIC UPDATE

            queryClient.setQueryData(

                [
                    "teacher-notices",
                    1,
                    10,
                ],

                (old: any) => {

                    if (!old) {
                        return [];
                    }

                    return old.filter(
                        (notice: any) =>
                            notice.id !== noticeId
                    );
                }
            );

            return {
                previousNotices,
            };
        },

        onError: (
            err,
            noticeId,
            context
        ) => {

            queryClient.setQueryData(

                [
                    "teacher-notices",
                    1,
                    10,
                ],

                context?.previousNotices
            );
        },

        onSettled: async () => {

            await queryClient.invalidateQueries({

                queryKey: [
                    "teacher-notices",
                ],
            });
        },
    });
};



// GET TEACHER TIMETABLE

export const useTeacherTimetable =
    () => {

        return useQuery({

            queryKey: [
                "teacher-timetable",
            ],

            queryFn: async () => {

                const response =
                    await getTeacherTimetable();

                // console.log(
                //   "TIMETABLE API =>",
                //   response
                // );

                return response;
            },
        });
    };



// CREATE TEACHER TIMETABLE

export const useCreateTeacherTimetable =
    () => {

        const queryClient =
            useQueryClient();

        return useMutation({

            mutationFn:
                createTeacherTimetable,

            onSuccess: () => {

                queryClient.invalidateQueries({

                    queryKey: [
                        "teacher-timetable",
                    ],
                });
            },
        });
    };



// UPDATE TEACHER TIMETABLE

export const useUpdateTeacherTimetable =
    () => {

        const queryClient =
            useQueryClient();

        return useMutation({

            mutationFn: ({
                id,
                data,
            }: {
                id: string;
                data: any;
            }) =>

                updateTeacherTimetable(
                    id,
                    data
                ),

            onSuccess: () => {

                queryClient.invalidateQueries({

                    queryKey: [
                        "teacher-timetable",
                    ],
                });
            },
        });
    };



// TEACHER DASHBOARD

export const useTeacherDashboard =
    () => {

        const {
            data: noticesResponse,
            isLoading:
            noticesLoading,
        } = useTeacherNotices();

        const {
            data: timetableResponse,
            isLoading:
            timetableLoading,
        } = useTeacherTimetable();

        const notices =
            noticesResponse || [];

        const timetable =
            timetableResponse || [];

        const recentNotices =
            notices.slice(0, 3);

        const currentDay =
            new Date().toLocaleDateString(
                "en-US",
                {
                    weekday: "short",
                }
            );

        const todayClasses =
            timetable.filter(
                (item: any) =>
                    item.day === currentDay
            );

        todayClasses.sort(
            (a: any, b: any) =>

                a.start_time.localeCompare(
                    b.start_time
                )
        );

        const stats = [

            {
                title:
                    "Today's Classes",

                value:
                    todayClasses.length,

                icon:
                    "classes",
            },

            {
                title:
                    "Total Notices",

                value:
                    notices.length,

                icon:
                    "notices",
            },

            {
                title:
                    "Subjects",

                value:
                    [
                        ...new Set(

                            timetable.map(
                                (item: any) =>
                                    item.subject
                            )
                        ),
                    ].length,

                icon:
                    "subjects",
            },

            {
                title:
                    "Weekly Classes",

                value:
                    timetable.length,

                icon:
                    "students",
            },
        ];

        return {

            stats,

            recentNotices,

            todayClasses,

            noticesLoading,

            timetableLoading,
        };
    };