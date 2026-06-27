import pkg from 'pg';
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

console.log("Your Connection URL is:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error: ', err);
    throw err; // Re-throw the error so the caller knows the connection failed
  }
};

export default pool;
