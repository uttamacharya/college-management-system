import type { PoolClient } from "pg";
import { appDB } from "../config/db.js";
import { redisClient } from "../config/redis.js";

import type {
  CreateNoticeInput,
  Notice,
  StudentRecord,
  TeacherRecord,
  UpdateNoticeInput,
} from "../types/index.js";

import { deleteNoticeImage, uploadNoticeImage } from "../utils/cloudinary.utils.js";

// Get Teacher By User ID 

export const getTeacherByUserId = async (
  userId: string
): Promise<TeacherRecord | null> => {


  const result = await appDB.query<TeacherRecord>(

    `
      SELECT *
      FROM teachers
      WHERE user_id = $1
    `,

    [userId]
  );

  return result.rows[0] || null;
};



//Get Student By User ID

export const getStudentByUserId = async (
  userId: string
): Promise<StudentRecord | null> => {

  const result = await appDB.query<StudentRecord>(

    `
      SELECT *
      FROM students
      WHERE user_id = $1
    `,

    [userId]
  );

  return result.rows[0] || null;
};

const invalidateStudentNoticeCache = async (studentId: string) => {
  const keys = await redisClient.keys(`student-notices:${studentId}:*`);
  if (keys.length > 0) await redisClient.del(keys);
};

const invalidateTeacherNoticeCache = async (teacherId: string) => {
  const keys = await redisClient.keys(`teacher-notices:${teacherId}:*`);
  if (keys.length > 0) await redisClient.del(keys);
};

const invalidateAllStudentNoticeCache = async () => {
  const keys = await redisClient.keys(`student-notices:*`);
  if (keys.length > 0) await redisClient.del(keys);
};

//Create Notice 

export const createNoticeService = async (
  teacherId: string,
  input: CreateNoticeInput,
  imageBuffer?: Buffer
): Promise<Notice> => {

  // validation

  if (!input.title?.trim()) {
    throw new Error("Title is required");
  }

  if (!input.description?.trim() && !imageBuffer) {
    throw new Error(
      "Notice must contain description or image"
    );
  }

  // Batch Validation
  if (input.target_batches?.length) {
    const currentYear = new Date().getFullYear();
    const isValid = input.target_batches.every(
      (batch) => batch >= 2000 && batch <= currentYear + 4
    );
    if (!isValid) {
      throw new Error("Invalid batch year");
    }
  }

  // Student ID Validation
  if (input.target_student_ids?.length) {
    const result = await appDB.query(
      `SELECT id FROM students WHERE id = ANY($1)`,
      [input.target_student_ids]
    );
    if (result.rows.length !== input.target_student_ids.length) {
      throw new Error("One or more student IDs are invalid");
    }
  }

  let image_url: string | null = null;
  let image_public_id: string | null = null;

  // ─── Upload Image 

  if (imageBuffer) {

    const uploaded = await uploadNoticeImage(imageBuffer);

    image_url = uploaded.url;
    image_public_id = uploaded.public_id;
  }

  // ─── Insert Notice ─────────────────

  const result = await appDB.query<Notice>(

    `
      INSERT INTO notices (
        teacher_id,
        title,
        description,
        image_url,
        image_public_id,
        target_batches,
        target_branches,
        importance,
        expires_at
      )

      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
      )

      RETURNING *
    `,

    [
      teacherId,
      input.title,
      input.description || null,
      image_url,
      image_public_id,
      input.target_batches || [],
      input.target_branches || [],
      input.importance || "medium",
      input.expires_at || null,
    ]
  );

  const notice = result.rows[0];

  if (!notice) {
    throw new Error("Failed to create notice");
  }



  // ─── Insert Specific Student Targets

  if (input.target_student_ids?.length) {

    const values = input.target_student_ids
      .map((_, i) => `($1, $${i + 2})`)
      .join(",");

    await appDB.query(

      `
        INSERT INTO notice_target_students (
          notice_id,
          student_id
        )

        VALUES ${values}

        ON CONFLICT DO NOTHING
      `,

      [notice.id, ...input.target_student_ids]
    );
  }

  return notice;
};


export const getStudentNoticesService = async (
  studentId: string,
  batch: number,
  branch: string,
  page: number,
  limit: number,
  sort: string
): Promise<Notice[]> => {

  // ─── Pagination──

  const offset = (page - 1) * limit;


  const cacheKey =

    `student-notices:${studentId}:${page}:${limit}:${sort}`;

  const cachedData =
    await redisClient.get(cacheKey);

  if (cachedData) {

    return JSON.parse(cachedData);
  }
  // ─── Sorting─────

  let orderBy = "n.created_at DESC";

  if (sort === "importance") {

    orderBy = `
      CASE n.importance
        WHEN 'high' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 3
      END
    `;
  }

  // ─── Query───────
  const result = await appDB.query<Notice>(

    `
      SELECT DISTINCT

        n.*,

       COALESCE(
         sns.is_read,
         false
      ) AS is_read,

      COALESCE(
        sns.is_starred,
        false
      ) AS is_starred

      FROM notices n

      LEFT JOIN notice_target_students nts
      ON nts.notice_id = n.id

      LEFT JOIN student_notice_status sns
      ON sns.notice_id = n.id
      AND sns.student_id = $1

      WHERE

      n.is_active = true

      AND
      (
        n.expires_at IS NULL
        OR n.expires_at > NOW()
      )

      AND
      (
        $2 = ANY(n.target_batches)

        OR

        array_length(n.target_batches, 1) IS NULL
      )

      AND
      (
        $3 = ANY(n.target_branches)

        OR

        array_length(n.target_branches, 1) IS NULL
      )

      AND
      (
        nts.student_id = $1

        OR

        nts.student_id IS NULL
      )

      AND
     (
       sns.is_hidden = false

       OR

       sns.is_hidden IS NULL
     )

      ORDER BY ${orderBy}

      LIMIT $4
      OFFSET $5
    `,

    [
      studentId,
      batch,
      branch,
      limit,
      offset
    ]
  );


  await redisClient.set(

    cacheKey,

    JSON.stringify(result.rows),

    {
      EX: 120,
    }
  );
  return result.rows;
};



// ─── Mark Notice As Read 

export const markNoticeAsReadService = async (
  noticeId: string,
  studentId: string
): Promise<void> => {

  await appDB.query(

    `
      INSERT INTO student_notice_status (

        notice_id,
        student_id,
        is_read,
        read_at

      )

      VALUES (

        $1,
        $2,
        true,
        NOW()

      )

      ON CONFLICT (notice_id, student_id)

      DO UPDATE SET

        is_read = true,
        read_at = NOW()
      WHERE
        student_notice_status.is_read = false
    `,

    [noticeId, studentId]
  );

  await invalidateStudentNoticeCache(studentId);
};




// ─── Toggle Notice Star 

export const toggleNoticeStarService = async (
  noticeId: string,
  studentId: string
): Promise<boolean> => {

  // ─── Check Existing Status 

  const existing = await appDB.query(

    `
      SELECT is_starred

      FROM student_notice_status

      WHERE notice_id = $1
      AND student_id = $2
    `,

    [noticeId, studentId]
  );

  // ─── If Already Exists 

  if (existing.rows.length > 0) {

    const currentStar =
      existing.rows[0].is_starred;

    const newStarValue =
      !currentStar;

    await appDB.query(

      `
        UPDATE student_notice_status

        SET
          is_starred = $1,
          starred_at =
            CASE
              WHEN $1 = true
              THEN NOW()
              ELSE NULL
            END

        WHERE notice_id = $2
        AND student_id = $3
      `,

      [
        newStarValue,
        noticeId,
        studentId
      ]
    );
    await invalidateStudentNoticeCache(studentId);

    return newStarValue;
  }

  // ─── First Time Insert 

  await appDB.query(

    `
      INSERT INTO student_notice_status (

        notice_id,
        student_id,
        is_starred,
        starred_at

      )

      VALUES (

        $1,
        $2,
        true,
        NOW()

      )
    `,

    [noticeId, studentId]
  );

  await invalidateStudentNoticeCache(studentId);
  return true;
};


// ─── Get Teacher Notices 

export const getTeacherNoticesService = async (
  teacherId: string,
  page: number,
  limit: number
): Promise<Notice[]> => {

  // ─── Pagination──

  const offset = (page - 1) * limit;

  // ─── Redis Cache─

  const cacheKey =

    `teacher-notices:${teacherId}:${page}:${limit}`;

  const cachedData =
    await redisClient.get(cacheKey);

  if (cachedData) {

    return JSON.parse(cachedData);
  }

  // ─── Query───────

  const result = await appDB.query<Notice>(

    `
      SELECT *

      FROM notices

      WHERE teacher_id = $1

      ORDER BY created_at DESC

      LIMIT $2
      OFFSET $3
    `,

    [
      teacherId,
      limit,
      offset
    ]
  );

  // ─── Save Cache──

  await redisClient.set(

    cacheKey,

    JSON.stringify(result.rows),

    {
      EX: 60,
    }
  );

  return result.rows;
};

// ─── Update Notice ───────────────────

export const updateNoticeService = async (
  teacherId: string,
  noticeId: string,
  input: UpdateNoticeInput,
  imageBuffer?: Buffer
): Promise<Notice> => {

  const client: PoolClient =
    await appDB.connect();

  try {

    // ─── Start Transaction ───────────

    await client.query("BEGIN");

    // ─── Find Existing Notice ────────

    const existingNotice =
      await client.query<Notice>(

        `
          SELECT *

          FROM notices

          WHERE id = $1
          AND teacher_id = $2
        `,

        [noticeId, teacherId]
      );

    const notice =
      existingNotice.rows[0];

    if (!notice) {

      throw new Error(
        "Notice not found"
      );
    }

    // ─── Existing Image State ────────

    let image_url =
      notice.image_url;

    let image_public_id =
      notice.image_public_id;

    // ─── Remove Existing Image ───────

    if (
      input.remove_image === true
      &&
      image_public_id
      &&
      !imageBuffer
    ) {

      await deleteNoticeImage(
        image_public_id
      );

      image_url = null;
      image_public_id = null;
    }

    // ─── Replace Image ───────────────

    if (imageBuffer) {

      if (image_public_id) {

        await deleteNoticeImage(
          image_public_id
        );
      }

      const uploaded =
        await uploadNoticeImage(
          imageBuffer
        );

      image_url =
        uploaded.url;

      image_public_id =
        uploaded.public_id;
    }

    // ─── Final Validation ────────────

    const finalDescription =

      input.description !== undefined
        ? input.description
        : notice.description;

    if (
      !finalDescription && !image_url ) {
      throw new Error(
        "Notice must contain description or image"
      );
    }

    // Batch Validation
    if (input.target_batches?.length) {
      const currentYear = new Date().getFullYear();
      const isValid = input.target_batches.every(
        (batch) => batch >= 2000 && batch <= currentYear + 4
      );
      if (!isValid) {
        throw new Error("Invalid batch year");
      }
    }

    // Student ID Validation
    if (input.target_student_ids?.length) {
      const result = await client.query(  // ← client use karo, appDB nahi
        `SELECT id FROM students WHERE id = ANY($1)`,
        [input.target_student_ids]
      );
      if (result.rows.length !== input.target_student_ids.length) {
        throw new Error("One or more student IDs are invalid");
      }
    }

    // ─── Update Notice ───────────────

    const updatedNotice =
      await client.query<Notice>(

        `
          UPDATE notices

          SET

            title =
              COALESCE($1, title),

            description =
              COALESCE($2, description),

            image_url = $3,

            image_public_id = $4,

            target_batches =
              COALESCE($5, target_batches),

            target_branches =
              COALESCE($6, target_branches),

            importance =
              COALESCE($7, importance),

            expires_at =
              COALESCE($8, expires_at),

            updated_at = NOW()

          WHERE id = $9

          RETURNING *
        `,

        [
          input.title ?? null,
          input.description ?? null,
          image_url,
          image_public_id,
          input.target_batches ?? null,
          input.target_branches ?? null,
          input.importance ?? null,
          input.expires_at ?? null,
          noticeId,
        ]
      );

    const updated =
      updatedNotice.rows[0];

    // ─── Check Update Success ────────

    if (!updated) {
      throw new Error(
        "Notice update failed or not found"
      );
    }

    // ─── Sync Target Students ────────

    if (input.target_student_ids !== undefined) {

      await client.query(

        `
          DELETE FROM notice_target_students

          WHERE notice_id = $1
        `,

        [noticeId]
      );

      if (input.target_student_ids.length) {

        const values =
          input.target_student_ids
            .map((_, i) => `($1, $${i + 2})`)
            .join(",");

        await client.query(

          `
            INSERT INTO notice_target_students (

              notice_id,
              student_id

            )

            VALUES ${values}

            ON CONFLICT DO NOTHING
          `,

          [noticeId, ...input.target_student_ids]
        );
      }
    }

    // ─── Commit Transaction ──────────

    await client.query("COMMIT");

    // ─── Clear Cache ─────────────────

    await invalidateTeacherNoticeCache(teacherId);
    await invalidateAllStudentNoticeCache();

    return updated;

  } catch (error) {

    // ─── Rollback ────────────────────

    await client.query("ROLLBACK");

    throw error;

  } finally {

    // ─── Release Client ──────────────

    client.release();
  }
};


// ─── Delete Notice 

export const deleteNoticeService = async (
  teacherId: string,
  noticeId: string
): Promise<void> => {

  const client =
    await appDB.connect();

  try {

    // ─── Start Transaction ───────────

    await client.query("BEGIN");

    // ─── Find Notice ─────────────────

    const existingNotice =
      await client.query<Notice>(

        `
          SELECT *

          FROM notices

          WHERE id = $1
          AND teacher_id = $2
        `,

        [noticeId, teacherId]
      );

    const notice =
      existingNotice.rows[0];

    if (!notice) {

      throw new Error(
        "Notice not found"
      );
    }

    // ─── Delete Cloudinary Image ─────

    if (notice.image_public_id) {

      await deleteNoticeImage(
        notice.image_public_id
      );
    }

    // ─── Soft Delete ─────────────────

    await client.query(

      `
        UPDATE notices

        SET
          is_active = false,
          updated_at = NOW()

        WHERE id = $1
      `,

      [noticeId]
    );

    // ─── Commit Transaction ──────────

    await client.query("COMMIT");

    // ─── Clear Cache ─────────────────

    await invalidateTeacherNoticeCache(teacherId);
    await invalidateAllStudentNoticeCache();

  } catch (error) {

    // ─── Rollback ────────────────────

    await client.query("ROLLBACK");

    throw error;

  } finally {

    // ─── Release Client

    client.release();
  }
};


// ─── Hide Notice For Student

export const hideNoticeForStudentService = async (
  noticeId: string,
  studentId: string
): Promise<void> => {

  await appDB.query(

    `
      INSERT INTO student_notice_status (

        notice_id,
        student_id,
        is_hidden

      )

      VALUES (

        $1,
        $2,
        true

      )

      ON CONFLICT (notice_id, student_id)

      DO UPDATE SET

        is_hidden = true
    `,

    [noticeId, studentId]
  );

  // ─── Clear Cache 

  await invalidateStudentNoticeCache(studentId);
};