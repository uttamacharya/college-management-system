import type { Response } from "express";
import type { AuthRequest } from "../config/auth.types.js";

import {
  syncStudentData,
  syncMarksData,
  getFullStudentData,
} from "../services/student.service.js";
import { appDB } from "../config/db.js";



// BASIC PROFILE

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


//  FULL PROFILE

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

export const getStudentMarks = async (req: AuthRequest, res: Response) => {
  try {
    const collegeId = req.user?.college_id;
    const userId = req.user?.id;
    const semester = req.query.semester;

    if (!collegeId || !userId) {
      return res.status(400).json({ message: "Invalid user" });
    }

    //  student sync
    const student = await syncStudentData(collegeId, userId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    //  marks sync (same logic reuse)
    await syncMarksData(student.id, collegeId);

    //  fetch semester-wise
    const result = await appDB.query(
      `SELECT 
         sub.name AS subject,
         m.marks,
         sub.semester
       FROM marks m
       JOIN subjects sub ON m.subject_id = sub.id
       WHERE m.student_id = $1
       ${semester ? "AND sub.semester = $2" : ""}
       ORDER BY sub.semester`,
      semester ? [student.id, semester] : [student.id]
    );

    res.json({
      data: result.rows,
    });

  } catch (error) {
    console.error("Marks error:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Error fetching marks" });
  }
};