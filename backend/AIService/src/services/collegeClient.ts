import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const USER_SERVICE_URL =
    process.env.USER_SERVICE_URL || "http://localhost:4000";

// =========================================
// STUDENT FULL PROFILE
// =========================================

export const fetchStudentProfile = async (
    token: string
) => {

    const response = await axios.get(
        `${USER_SERVICE_URL}/api/student/full-profile`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

// =========================================
// TEACHER TIMETABLE
// =========================================

export const fetchTeacherTimetable = async (
    token: string
) => {

    const response = await axios.get(
        `${USER_SERVICE_URL}/api/teacher/timetable`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};