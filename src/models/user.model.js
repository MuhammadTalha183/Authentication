import pool from "../../config/database.js";

// SQL Script to create the table if it doesn't exist
const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

export const initUserModel = async () => {
  try {
    await pool.query(createUsersTableQuery);
    console.log("Users table initialized successfully or already exists.");
  } catch (err) {
    console.error("Error creating users table:", err);
    throw err;
  }
};
