import { pool } from "../config/db"

const initDB = async () => {

  try {

    console.log("Initializing database...");


    // enable extension
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);


    // users table
    await pool.query(`

      CREATE TABLE IF NOT EXISTS users (

        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        email VARCHAR(255) UNIQUE NOT NULL,

        password TEXT NOT NULL,

        role VARCHAR(20) NOT NULL CHECK (
          role IN ('student','teacher','admin')
        ),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

      );

    `);
// student table
    await pool.query(`

      CREATE TABLE IF NOT EXISTS students (

        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,

        full_name VARCHAR(255) NOT NULL,

        roll_no VARCHAR(50) UNIQUE NOT NULL,

        branch VARCHAR(50),

        semester INT,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

      );

    `);


    console.log("Database initialized successfully");

  }

  catch (error) {

    console.error("Database initialization failed");

    console.error(error);

  }

  finally {

    await pool.end();

  }

};


initDB();