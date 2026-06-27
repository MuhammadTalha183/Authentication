// import pool from "../../config/database.js"; // Import your pg pool
// import crypto from "crypto";
// import jwt from "jsonwebtoken";
// import config from "../../config/config.js";
// // import { sendEmail } from "../services/email.service.js";
// // import { generateOtp, getOtpHtml } from "../utils/utils.js";
// // Note: If you also move sessions and OTPs to Postgres, you'll drop these Mongoose imports
// // import sessionModel from "../models/session.model.js";
// // import otpModel from "../models/otp.model.js";

// export async function registerUser(req, res) {
//     try {
//         const { username, email, password } = req.body;

//         // 1. Check if user already exists ($or alternative)
//         const checkUserQuery = `
//             SELECT id FROM users 
//             WHERE username = $1 OR email = $2 
//             LIMIT 1;
//         `;
//         const existingUserCheck = await pool.query(checkUserQuery, [username, email]);

//         if (existingUserCheck.rows.length > 0) {
//             return res.status(409).json({
//                 message: "Username or email already exists"
//             });
//         }

//         // 2. Hash the password
//         const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

//         // 3. Create the user and return the inserted row (RETURNING * mimics Mongoose response)
//         const createUserQuery = `
//             INSERT INTO users (username, email, password) 
//             VALUES ($1, $2, $3) 
//             RETURNING id, username, email, verified;
//         `;
//         const newUserResult = await pool.query(createUserQuery, [username, email, hashedPassword]);
//         const user = newUserResult.rows[0]; // Postgres returns data inside a 'rows' array

//         // 4. Generate OTP
//         const otp = generateOtp();
//         const html = getOtpHtml(otp);
//         const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

//         /* 
//         5. Save OTP to DB 
//         If you haven't moved your OTP table to Postgres yet, keep using otpModel.create().
//         If you DID create an 'otps' table in Postgres, use this query instead:
        
//         const createOtpQuery = `
//             INSERT INTO otps (email, user_id, otp_hash) 
//             VALUES ($1, $2, $3);
//         `;
//         await pool.query(createOtpQuery, [email, user.id, otpHash]);
//         */

//         // 6. Send the Email
//         await sendEmail(email, "OTP Verification", `Your OTP code is ${otp}`, html);

//         // 7. Send Response
//         return res.status(201).json({
//             message: "User registered successfully",
//             user: {
//                 username: user.username,
//                 email: user.email,
//                 verified: user.verified
//             },
//         });

//     } catch (error) {
//         console.error("Registration Error: ", error);
//         return res.status(500).json({
//             message: "Internal server error"
//         });
//     }
// }



import pool from "../../config/database.js"; // Import your pg pool
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../../config/config.js";

export async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        // 1. Check if user already exists
        const checkUserQuery = `
            SELECT id FROM users 
            WHERE username = $1 OR email = $2 
            LIMIT 1;
        `;
        const existingUserCheck = await pool.query(checkUserQuery, [username, email]);

        if (existingUserCheck.rows.length > 0) {
            return res.status(409).json({
                message: "Username or email already exists"
            });
        }

        // 2. Hash the password
        const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

        // 3. Create the user in PostgreSQL
        const createUserQuery = `
            INSERT INTO users (username, email, password, verified) 
            VALUES ($1, $2, $3, true) 
            RETURNING id, username, email, verified;
        `; // Setting verified to true directly since we are skipping OTP
        const newUserResult = await pool.query(createUserQuery, [username, email, hashedPassword]);
        const user = newUserResult.rows[0]; 

        // 4. Generate the JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            config.jwtSecret || process.env.JWT_SECRET, // Fallback to process.env if your config file varies
            { expiresIn: "24h" }
        );

        // 5. Send Response with the Token
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                verified: user.verified
            },
        });

    } catch (error) {
        console.error("Registration Error: ", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
