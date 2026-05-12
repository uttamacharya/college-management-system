import express from "express";

import { createNotice, getStudentNotices, getTeacherNotices, markNoticeAsRead, toggleNoticeStar, updateNotice } from "../controller/notice.controller.js";

import { isAuth } from "../middleware/isAuth.js";

import { isTeacher } from "../middleware/isTeacher.js";

import { upload } from "../middleware/upload.js";

const router = express.Router();

// ─── Create Notice

router.post(
  "/create",
  isAuth,
  isTeacher,
  upload.single("image"),
  createNotice
);


router.get(
  "/student",
  isAuth,
  getStudentNotices
);


router.post(
  "/read/:noticeId",
  isAuth,
  markNoticeAsRead
);

// ─── Toggle Notice Star ──────────────────────────────────────────────────────

router.post(
  "/star/:noticeId",
  isAuth,
  toggleNoticeStar
);

// ─── Get Teacher Notices ─────────────────────────────────────────────────────

router.get(
  "/teacher",
  isAuth,
  isTeacher,
  getTeacherNotices
);

// ─── Update Notice ───────────────────────────────────────────────────────────

router.patch(
  "/update/:noticeId",
  isAuth,
  isTeacher,
  upload.single("image"),
  updateNotice
);

export default router;