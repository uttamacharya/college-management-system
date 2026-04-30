import { appDB } from "../config/db.js";
import { collegeDB } from "../config/collegeDB.js";

export const findOrCreateUser = async (collegeId: string) => {
  try {
    //Local DB check
    const local = await appDB.query(
      "SELECT id, email, name, role, password FROM users WHERE college_id = $1",
      [collegeId]
    );

    let user = local.rows[0];

    //Agar user nahi mila
    if (!user) {
      // college DB check
      const college = await collegeDB.query(
        "SELECT email, name, college_id, role FROM college_users WHERE college_id = $1",
        [collegeId]
      );

      const collegeUser = college.rows[0];

      if (!collegeUser) return null;

      //Insert with ON CONFLICT (safe)
      const insert = await appDB.query(
        `INSERT INTO users (email, name, college_id, role, is_verified)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (college_id) DO NOTHING
         RETURNING id, email, name, role, password`,
        [
          collegeUser.email,
          collegeUser.name,
          collegeUser.college_id,
          collegeUser.role,
          true,
        ]
      );

      //Agar insert nahi hua (already exists)
      if (insert.rows.length === 0) {
        const retry = await appDB.query(
          "SELECT id, email, name, role, password FROM users WHERE college_id = $1",
          [collegeId]
        );
        user = retry.rows[0];
      } else {
        user = insert.rows[0];
      }
    }

    return user;
  } catch (error: any) {
    console.error("findOrCreateUser error:", error.message);
    throw new Error("User fetch failed");
  }
};