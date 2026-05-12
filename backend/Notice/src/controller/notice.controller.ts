import type { Response } from "express";

import type { AuthenticatedRequest, UpdateNoticeInput } from "../types/index.js";

import { createNoticeService, getStudentByUserId, getStudentNoticesService, getTeacherByUserId, getTeacherNoticesService, markNoticeAsReadService, toggleNoticeStarService, updateNoticeService } from "../service/notice.service.js";


import { parseStudentCollegeId }
  from "../utils/parseStudentCollegeId.js";


export const createNotice = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {

  try {

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const teacher = await getTeacherByUserId(userId);

    if (!teacher) {
      res.status(403).json({
        success: false,
        message: "Teacher not found",
      });
      return;
    }

    const teacherId = teacher.id;

    const notice = await createNoticeService(
      teacherId,
      req.body,
      req.file?.buffer
    );

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      notice,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};


// ─── Get Student Notices 

export const getStudentNotices = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {

  try {

    const userId = req.user?.id;

    const collegeId =
      req.user?.college_id;

    // ─── Pagination 

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const sort =
      (req.query.sort as string)
      || "latest";

    if (!userId || !collegeId) {

      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    // ─── Find Student 

    const student =
      await getStudentByUserId(userId);

    if (!student) {

      res.status(404).json({
        success: false,
        message: "Student not found",
      });

      return;
    }

    // ─── Parse Student College ID 

    const {
      admissionYear,
      branch,
    } = parseStudentCollegeId(collegeId);

    // ─── Fetch Notices 

    const notices =
      await getStudentNoticesService(
        student.id,
        admissionYear,
        branch,
        page,
        limit,
        sort
      );

    //  Response 

    res.status(200).json({
      success: true,
      page,
      limit,
      count: notices.length,
      notices,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};


// ─── Mark Notice As Read 

export const markNoticeAsRead = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {

  try {

    const userId = req.user?.id;

    const noticeId = req.params.noticeId as string;

    if (!userId) {

      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    // ─── Find Student

    const student =
      await getStudentByUserId(userId);

    if (!student) {

      res.status(404).json({
        success: false,
        message: "Student not found",
      });

      return;
    }

    // ─── Mark Read 

    await markNoticeAsReadService(
      noticeId,
      student.id
    );

    res.status(200).json({
      success: true,
      message: "Notice marked as read",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};

// ─── Toggle Notice Star ─

export const toggleNoticeStar = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {

  try {

    const userId = req.user?.id;

    const noticeId = req.params.noticeId as string;

    if (!userId) {

      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    // ─── Find Student ───

    const student =
      await getStudentByUserId(userId);

    if (!student) {

      res.status(404).json({
        success: false,
        message: "Student not found",
      });

      return;
    }

    // ─── Toggle Star ────

    const isStarred =
      await toggleNoticeStarService(
        noticeId,
        student.id
      );

    res.status(200).json({
      success: true,
      is_starred: isStarred,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};

// ─── Get Teacher Notices
export const getTeacherNotices = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {

  try {

    const userId = req.user?.id;

    if (!userId) {

      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    // ─── Pagination 

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    // ─── Find Teacher ─

    const teacher =
      await getTeacherByUserId(userId);

    if (!teacher) {

      res.status(404).json({
        success: false,
        message: "Teacher not found",
      });

      return;
    }

    // ─── Fetch Notices ──

    const notices =
      await getTeacherNoticesService(
        teacher.id,
        page,
        limit
      );

    // ─── Response ───

    res.status(200).json({
      success: true,
      page,
      limit,
      count: notices.length,
      notices,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};


// ─── Update Notice ───
export const updateNotice = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {

  try {

    const userId =
      req.user?.id;

    if (!userId) {

      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    // ─── Notice Id ───
    const noticeId =
      req.params.noticeId as string;

    // ─── Find Teacher 
    const teacher =
      await getTeacherByUserId(
        userId
      );

    if (!teacher) {

      res.status(404).json({
        success: false,
        message: "Teacher not found",
      });

      return;
    }

    // ─── Input ───────
    const input: UpdateNoticeInput = {

      title:
        req.body.title,

      description:
        req.body.description,

      target_years:
        req.body.target_years
          ? JSON.parse(
              req.body.target_years
            )
          : undefined,

      target_branches:
        req.body.target_branches
          ? JSON.parse(
              req.body.target_branches
            )
          : undefined,

      target_student_ids:
        req.body.target_student_ids
          ? JSON.parse(
              req.body.target_student_ids
            )
          : undefined,

      importance:
        req.body.importance,

      expires_at:
        req.body.expires_at,

      remove_image:
        req.body.remove_image === "true",
    };

    // ─── Image Buffer 
    const imageBuffer =
      req.file?.buffer;

    // ─── Update Notice ──────────

    const updatedNotice =
      await updateNoticeService(

        teacher.id,

        noticeId,

        input,

        imageBuffer
      );

    // ─── Response ────
    res.status(200).json({

      success: true,

      message:
        "Notice updated successfully",

      notice:
        updatedNotice,
    });

  } catch (error: any) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message ||
        "Server error",
    });
  }
};