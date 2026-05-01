import type { Response } from "express";
import type { AuthRequest } from "../config/auth.types.js";

import {
  createTimetable,
  getTeacherTimetable,
  updateTimetable,
} from "../services/teacherTimeTable.service.js";
import { appDB } from "../config/db.js";


//helper
const getTeacherId = async (userId: string) => {
  const res = await appDB.query(
    "SELECT id FROM teachers WHERE user_id = $1",
    [userId]
  );
  return res.rows[0]?.id;
};


//CREATE
export const createTeacherTimetable = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const teacherId = await getTeacherId(userId);

    if (!teacherId) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const timetable = await createTimetable(teacherId, req.body);

    res.status(201).json({
      message: "Timetable created",
      timetable,
    });

  } catch (error) {
    console.error("create timetable error:", error);
    res.status(500).json({ message: "Error creating timetable" });
  }
};


//  GET
export const getTimetable = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const teacherId = await getTeacherId(userId);

    if (!teacherId) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const data = await getTeacherTimetable(teacherId);

    res.json({ data });

  } catch (error) {
    console.error("get timetable error:", error);
    res.status(500).json({ message: "Error fetching timetable" });
  }
};


// UPDATE
export const updateTeacherTimetable = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const timetableId = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const teacherId = await getTeacherId(userId);

    if (!teacherId) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const updated = await updateTimetable(
      teacherId,
      timetableId,
      req.body
    );

    res.json({
      message: "Updated successfully",
      updated,
    });

  } catch (error) {
    console.error("update timetable error:", error);
    res.status(500).json({ message: "Error updating timetable" });
  }
};