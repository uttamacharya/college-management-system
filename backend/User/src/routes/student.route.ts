import express from "express";
import { getStudentProfile, getStudentFullProfile, getStudentMarks } from "../controller/student.controller.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

// Basic profile
router.get("/profile", isAuth, getStudentProfile);

// Full profile (marks + subjects)
router.get("/full-profile", isAuth, getStudentFullProfile);
router.get("/marks", isAuth,  getStudentMarks);

export default router;