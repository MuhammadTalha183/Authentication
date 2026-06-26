import dotenv from "dotenv";
dotenv.config();


const config = {
  port: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
//   jwtSecret: process.env.JWT_SECRET 
};


export default config;  