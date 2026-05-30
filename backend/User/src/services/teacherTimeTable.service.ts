import { appDB } from "../config/db.js";

type TimetableInput = {
  day: string;
  start_time: string;
  end_time: string;
  subject?: string;
  room?: string;
};

export const syncTeacherData = async (userId: string) => {
  const result = await appDB.query(
    "SELECT id FROM teachers WHERE user_id = $1",
    [userId]
  );

  if (result.rows.length === 0) {
    const teacher = await appDB.query(
      `INSERT INTO teachers (user_id, department, designation)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, "CSE", "Assistant Professor"]
    );

    return teacher.rows[0];
  }

  return result.rows[0];
};
// CREATE
export const createTimetable = async (
  teacherId: string,
  data: TimetableInput
) => {
  const { day, start_time, end_time, subject, room } = data;

  if (!day || !start_time || !end_time) {
    throw new Error("Missing required fields");
  }

  let subjectId=null;

  if(subject){
    const existing=await appDB.query(
      `SELECT id FROM subjects WHERE name= $1`,
      [subject]
    );
    if(existing.rows.length >0){
      subjectId=existing.rows[0].id;
    }else{
      const created=await appDB.query(
        `INSERT INTO subjects (name, semester, stream)
        VALUES($1, $2, $3)
        RETURNING id`,
        [subject, 1, "CSE"]
      );
      subjectId=created.rows[0].id;
    }
  }
  

  const result = await appDB.query(
    `INSERT INTO timetables 
     (teacher_id, day, start_time, end_time, subject_id, room)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [teacherId, day, start_time, end_time, subjectId || null, room || null]
  );

  return result.rows[0];
};


// GET
export const getTeacherTimetable = async (teacherId: string) => {
  // const result = await appDB.query(
  //   `SELECT * FROM timetables 
  //    WHERE teacher_id = $1
  //    ORDER BY day, start_time`,
  //   [teacherId]
  // );
  const result = await appDB.query(
  `SELECT 
     t.id,
     t.day,
     t.start_time,
     t.end_time,
     s.name AS subject,   
     t.room
   FROM timetables t
   LEFT JOIN subjects s ON t.subject_id = s.id
   WHERE t.teacher_id = $1
   ORDER BY t.day, t.start_time`,
  [teacherId]
);

  return result.rows;
};


// UPDATE
export const updateTimetable = async (
  teacherId: string,
  timetableId: string,
  data: TimetableInput
) => {
  const { day, start_time, end_time, subject, room } = data;

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
      subject || null,
      room || null,
      timetableId,
      teacherId,
    ]
  );

  return result.rows[0];
};