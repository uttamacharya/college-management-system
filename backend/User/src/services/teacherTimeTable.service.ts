import { appDB } from "../config/db.js";

type TimetableInput = {
  day: string;
  start_time: string;
  end_time: string;
  subject_id?: string;
  room?: string;
};


// =========================
// CREATE
// =========================
export const createTimetable = async (
  teacherId: string,
  data: TimetableInput
) => {
  const { day, start_time, end_time, subject_id, room } = data;

  if (!day || !start_time || !end_time) {
    throw new Error("Missing required fields");
  }

  const result = await appDB.query(
    `INSERT INTO timetables 
     (teacher_id, day, start_time, end_time, subject_id, room)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [teacherId, day, start_time, end_time, subject_id || null, room || null]
  );

  return result.rows[0];
};


// =========================
// GET
// =========================
export const getTeacherTimetable = async (teacherId: string) => {
  const result = await appDB.query(
    `SELECT * FROM timetables 
     WHERE teacher_id = $1
     ORDER BY day, start_time`,
    [teacherId]
  );

  return result.rows;
};


// =========================
// UPDATE
// =========================
export const updateTimetable = async (
  teacherId: string,
  timetableId: string,
  data: TimetableInput
) => {
  const { day, start_time, end_time, subject_id, room } = data;

  const result = await appDB.query(
    `UPDATE timetables
     SET day = $1,
         start_time = $2,
         end_time = $3,
         subject_id = $4,
         room = $5
     WHERE id = $6 AND teacher_id = $7
     RETURNING *`,
    [
      day,
      start_time,
      end_time,
      subject_id || null,
      room || null,
      timetableId,
      teacherId,
    ]
  );

  return result.rows[0];
};