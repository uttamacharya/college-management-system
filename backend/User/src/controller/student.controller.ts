import type { Response } from "express";
import type { AuthRequest } from "../config/auth.types.js";

import {
  syncStudentData,
  syncMarksData,
  getFullStudentData,
} from "../services/student.service.js";


// =========================
// 🔥 BASIC PROFILE
// =========================
export const getStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const collegeId = req.user?.college_id;
    const userId = req.user?.id;

    if (!collegeId || !userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const student = await syncStudentData(collegeId, userId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ student });

  } catch (error) {
    console.error("getStudentProfile error:", error);
    res.status(500).json({ message: "Error fetching student" });
  }
};


// =========================
// 🔥 FULL PROFILE
// =========================
export const getStudentFullProfile = async (req: AuthRequest, res: Response) => {
  try {
    const collegeId = req.user?.college_id;
    const userId = req.user?.id;

    if (!collegeId || !userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 1. student sync
    const student = await syncStudentData(collegeId, userId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2. marks sync
    await syncMarksData(student.id, collegeId);

    // 3. fetch full data
    const data = await getFullStudentData(collegeId);

    res.json({
      message: "Student full data",
      data,
    });

  } catch (error) {
    console.error("getStudentFullProfile error:", error);
    res.status(500).json({
      message: "Error fetching full data",
    });
  }
};