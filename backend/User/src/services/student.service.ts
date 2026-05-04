import { appDB } from "../config/db.js";
import { collegeDB } from "../config/collegeDB.js";


// STUDENT SYNC
export const syncStudentData = async (collegeId: string, userId: string) => {
  const client = await appDB.connect();

  try {
    await client.query("BEGIN");

    //  only student
    const collegeRes = await collegeDB.query(
      "SELECT * FROM college_users WHERE college_id = $1 AND role = 'student'",
      [collegeId]
    );

    const student = collegeRes.rows[0];
    if (!student) {
      throw new Error("Student not found in college DB");
    }

    //get stream from separate table
    const streamRes = await collegeDB.query(
      "SELECT stream FROM college_students WHERE college_id = $1",
      [collegeId]
    );

    const stream = streamRes.rows[0]?.stream || "UNKNOWN";

    //insert/update
    const result = await client.query(
      `INSERT INTO students (user_id, college_id, name, email, stream)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (college_id)
       DO UPDATE SET 
         name = EXCLUDED.name,
         email = EXCLUDED.email,
         stream = EXCLUDED.stream
       RETURNING *`,
      [userId, student.college_id, student.name, student.email, stream]
    );

    await client.query("COMMIT");
    return result.rows[0];

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};


//MARKS SYNC

export const syncMarksData = async (studentId: string, collegeId: string) => {
  const client = await appDB.connect();

  try {
    await client.query("BEGIN");

    const collegeMarks = await collegeDB.query(
      `SELECT subject, semester, marks
       FROM college_marks
       WHERE college_id = $1`,
      [collegeId]
    );

    const marksData = collegeMarks.rows;

    //get stream once
    const studentRes = await client.query(
      "SELECT stream FROM students WHERE id = $1",
      [studentId]
    );

    const stream = studentRes.rows[0]?.stream || "UNKNOWN";

    for (const item of marksData) {

      // SUBJECT INSERT SAFE

      let subjectId;

      const subjectInsert = await client.query(
        `INSERT INTO subjects (name, semester, stream)
         VALUES ($1, $2, $3)
         ON CONFLICT (name, semester, stream)
         DO NOTHING
         RETURNING id`,
        [item.subject, item.semester, stream]
      );

      if (subjectInsert.rows.length > 0) {
        subjectId = subjectInsert.rows[0].id;
      } else {
        const existing = await client.query(
          `SELECT id FROM subjects 
           WHERE name = $1 AND semester = $2 AND stream = $3`,
          [item.subject, item.semester, stream]
        );
        subjectId = existing.rows[0].id;
      }


      // MARKS INSERT SAFE

      await client.query(
        `INSERT INTO marks (student_id, subject_id, marks,      max_marks)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (student_id, subject_id, attempt)
          DO UPDATE SET 
          marks = EXCLUDED.marks,
          max_marks = EXCLUDED.max_marks`,
        [studentId, subjectId, item.marks, 10]
      );
    }

    await client.query("COMMIT");

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};



// GET FULL PROFILE
export const getFullStudentData = async (collegeId: string) => {

  const result = await appDB.query(
    `SELECT 
        s.id,
        s.name,
        s.email,
        s.stream,
        sub.name AS subject,
        sub.semester,
        m.marks
     FROM students s
     LEFT JOIN marks m ON s.id = m.student_id
     LEFT JOIN subjects sub ON m.subject_id = sub.id
     WHERE s.college_id = $1`,
    [collegeId]
  );

  const rows = result.rows;

  if (rows.length === 0) return null;

  //group data clean
  const student = {
    id: rows[0].id,
    name: rows[0].name,
    email: rows[0].email,
    stream: rows[0].stream,
    subjects: [] as any[],
  };

  for (const row of rows) {
    if (row.subject) {
      student.subjects.push({
        subject: row.subject,
        semester: row.semester,
        marks: row.marks,
      });
    }
  }

  return student;
};