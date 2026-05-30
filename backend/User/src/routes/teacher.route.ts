import express from "express";
import {
  createTeacherTimetable,
  getTimetable,
  updateTeacherTimetable,
} from "../controller/teacherTimetable.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import { isTeacher } from "../middleware/isTeacher.js";

const router = express.Router();

router.post("/", isAuth, isTeacher, createTeacherTimetable);
router.get("/", isAuth, isTeacher, getTimetable);
router.put("/:id", isAuth, isTeacher, updateTeacherTimetable);

export default router;