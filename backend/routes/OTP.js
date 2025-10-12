// import express from "express";
// import cors from "cors";
// import { Router } from "express";
// import {getDB} from "../database.js"
// import cookieParser from 'cookie-parser';
// import session from "express-session";
// import { Resend } from "resend";
// import jwt from "jsonwebtoken";
// import bcrypt from 'bcrypt';


// const otpRoute = express();
// otpRoute.use(express.json());
// // dotenv.config();

// const resend = new Resend(process.env.RESEND_API_KEY);
// let otpStore = {};

// export const signupUser = async (req, res) => {
//     const db = getDB();
//     const { firstname, lastname, contactnumber, birthday, email, username, address, password } = req.body;

//     try {
//         // Check if email or username exists
//         const [existing] = await db.query(`SELECT * FROM users WHERE email = ? OR username = ?`, [email, username]);
//         if (existing.length > 0) {
//             return res.status(409).json({ message: "Email or Username already exists" });
//         }

//         // Hash password but don't save yet
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Generate OTP
//         const otp = Math.floor(100000 + Math.random() * 900000);
//         otpStore[email] = { otp, data: { firstname, lastname, contactnumber, birthday, email, username, address, password: hashedPassword }, expires: Date.now() + 5 * 60 * 1000 };

//         // Send OTP via Resend
//         const emailResponse = await resend.emails.send({
        
        
//         from: process.env.EMAIL_FROM || "WhiskerWatch <onboarding@resend.dev>",
//         // from:"WhiskerWatch <noreply@whiskerwatch.site>",
//         to: email,
//         subject: "WhiskerWatch OTP Verification",
//         html: `
//             <h2>Verify Your Email</h2>
//             <p>Hi ${firstname},</p>
//             <p>Your One-Time Password (OTP) is:</p>
//             <h1>${otp}</h1>
//             <p>This code expires in 5 minutes.</p>
//         `,
//         });

//         console.log("This is Resend email response: ", emailResponse);
//         console.log("Received signup from:", email);

//         res.json({ message: "OTP sent to your email!" });

//     } catch (err) {
//         console.error("Signup error:", err);
//         res.status(500).json({ message: "Error creating user or sending OTP" });
//     }
// };



// export const verifyOtp = async (req, res) => {
//     const { email, otp } = req.body;
//     const db = getDB();

//     try {
//         const stored = otpStore[email];
//         if (!stored) return res.status(400).json({ error: "No OTP found. Please sign up again." });

//         if (Date.now() > stored.expires) {
//             delete otpStore[email];
//             return res.status(400).json({ error: "OTP expired. Please request a new one." });
//         }

//         if (parseInt(otp) !== stored.otp) {
//             return res.status(400).json({ error: "Invalid OTP. Please try again." });
//         }

//         // OTP correct — save user to database
//         const { firstname, lastname, contactnumber, birthday, username, address, password } = stored.data;

//         await db.query(
//             `INSERT INTO users (firstname, lastname, contactnumber, birthday, email, username, address, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//             [firstname, lastname, contactnumber, birthday, email, username, address, password]
//         );

//         delete otpStore[email]; // cleanup
//         res.json({ message: "Email verified and account created successfully!" });
//     } catch (err) {
//         console.error("Verify OTP error:", err);
//         res.status(500).json({ error: "Error verifying OTP" });
//     }
// };


// //  RESEND OTP
// export const resendOtp = async (req, res) => {
//     const { email } = req.body;
//     const db = getDB();

//     try {
//         // Check if OTP exists for this email
//         const stored = otpStore[email];
//         if (!stored) {
//         return res.status(400).json({ error: "No existing signup session found. Please sign up again." });
//         }

//         // Generate a new OTP
//         const newOtp = Math.floor(100000 + Math.random() * 900000);
//         otpStore[email].otp = newOtp;
//         otpStore[email].expires = Date.now() + 5 * 60 * 1000; // Reset expiration time

//         // Send via Resend
//         const { firstname } = stored.data;
//         const response = await resend.emails.send({
//         from: process.env.EMAIL_FROM || "WhiskerWatch <onboarding@resend.dev>",
//         // from: "WhiskerWatch <onboarding@resend.dev>",
//         to: email,
//         subject: "WhiskerWatch - Resent OTP Verification Code",
//         html: `
//             <h2>Password Reset Request</h2>
//             <p>Hi ${firstname}</p>
//             <p>Your One-Time Password (OTP) is:</p>
//             <h1>${otp}</h1>
//             <p>Please enter this code to complete your account verification process.</p>
//             <br>
//             <br>
//             <p>This code will expire in 5 minutes.</p>
//             <br>
//             <br>
//             <p>If you didn't request this, please ignore this message and never share it with anyone to keep your WhiskerWatch account safe.</p>
//             <br>
//             <br>
//             <p>Thanks for helping keep our cat community secure!</p>
//             <strong>- WhiskerWatch Team</strong>
//         `,
//         });

//         console.log("Resend email response:", response);
//         res.json({ message: "New OTP sent to your email!" });

//     } catch (err) {
//         console.error("Resend OTP error:", err);
//         res.status(500).json({ error: "Failed to resend OTP" });
//     }
// };



// // FORGOT PASSWORD
// export const forgotPassword = async (req, res) => {
//     const db = getDB();
//     const { email } = req.body;

//     try {
//         // Check if user exists
//         const [user] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
//         if (user.length === 0) {
//         return res.status(404).json({ error: "No account found with this email." });
//         }

//         // Generate OTP
//         const generatedOtp = Math.floor(100000 + Math.random() * 900000);
//         otpStore[email] = { otp:generatedOtp, type: "password_reset", expires: Date.now() + 5 * 60 * 1000 };

//         // Send OTP via Resend
//         const response = await resend.emails.send({
//         from: process.env.EMAIL_FROM || "WhiskerWatch <noreply@whiskerwatch.site>",
//         to: email,
//         subject: "WhiskerWatch Password Reset",
//         html: `
//             <h2>Password Reset Request</h2>
//             <p>Hi ${user.firstname} ${user.lastname}</p>
//             <p>Your One-Time Password (OTP) is:</p>
//             <h1>${otp}</h1>
//             <p>Please enter this code to continue your password reset request.</p>
//             <br>
//             <br>
//             <p>This code will expire in 5 minutes.</p>
//             <br>
//             <br>
//             <p>If you didn't request this, please ignore this message and never share it with anyone to keep your WhiskerWatch account safe.</p>
//             <br>
//             <br>
//             <p>Thanks for helping keep our cat community secure!</p>
//             <strong>- WhiskerWatch Team</strong>
//         `,
//         });

//         console.log("Forgot password email response:", response);
//         res.json({ message: "OTP sent to your email for password reset." });
//     } catch (err) {
//         console.error("Forgot password error:", err);
//         res.status(500).json({ error: "Error sending OTP for password reset." });
//     }
// };


// // RESET PASSWORD
// export const resetPassword = async (req, res) => {
//     const db = getDB();
//     const { email, otp, newPassword } = req.body;

//     try {
//         const stored = otpStore[email];
//         if (!stored || stored.type !== "password_reset") {
//         return res.status(400).json({ error: "No valid OTP found for this email." });
//         }

//         if (Date.now() > stored.expires) {
//         delete otpStore[email];
//         return res.status(400).json({ error: "OTP expired. Please request a new one." });
//         }

//         if (parseInt(otp) !== stored.otp) {
//         return res.status(400).json({ error: "Invalid OTP. Please try again." });
//         }

//         // OTP verified → hash and update password
//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         await db.query(`UPDATE users SET password = ? WHERE email = ?`, [hashedPassword, email]);

//         delete otpStore[email]; // clean up
//         res.json({ message: "Password has been reset successfully." });
//     } catch (err) {
//         console.error("Reset password error:", err);
//         res.status(500).json({ error: "Error resetting password." });
//     }
// };


// // controllers/userController.js

// export const verifyResetOtp = async (req, res) => {
//     const { email, otp } = req.body;
//     const db = getDB();

//     try {
//         const stored = otpStore[email];
//         if (!stored) return res.status(400).json({ message: "No OTP found. Please request again." });

//         if (Date.now() > stored.expires) {
//             delete otpStore[email];
//             return res.status(400).json({ message: "OTP expired. Please request a new one." });
//         }

//         if (parseInt(otp) !== stored.otp) {
//             return res.status(400).json({ message: "Invalid OTP. Please try again." });
//         }

//         // OTP is valid — just acknowledge success (no DB insert)
//         res.status(200).json({ message: "OTP verified successfully!" });
//     } catch (err) {
//         console.error("Reset OTP verification error:", err);
//         res.status(500).json({ message: "Error verifying OTP" });
//     }
// };



// export default otpRoute;
// backend/routes/OTP.js
import express from "express";
import { getDB } from "../database.js";
import { Resend } from "resend";
import bcrypt from "bcrypt";

const otpRoute = express();
otpRoute.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);
let otpStore = {}; // In-memory: { [email]: { otp, type, data?, expires } }

// ----------------------
// SIGNUP + OTP
// ----------------------
export const signupUser = async (req, res) => {
    const db = getDB();
    const { firstname, lastname, contactnumber, birthday, email, username, address, password } = req.body;

    try {
        // check duplicates
        const [existing] = await db.query(
            `SELECT * FROM users WHERE email = ? OR username = ?`,
            [email, username]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: "Email or Username already exists" });
        }

        // hash password (we store only after OTP verified)
        const hashedPassword = await bcrypt.hash(password, 10);

        // generate signup OTP and store signup-related data
        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[email] = {
            otp,
            type: "signup",
            data: { firstname, lastname, contactnumber, birthday, email, username, address, password: hashedPassword },
            expires: Date.now() + 5 * 60 * 1000,
        };

        // send email (kept body as you asked)
        const emailResponse = await resend.emails.send({
        from: process.env.EMAIL_FROM || "WhiskerWatch <onboarding@resend.dev>",
        to: email,
        subject: "WhiskerWatch OTP Verification",
        html: `
            <h2>Verify Your Email</h2>
            <p>Hi ${firstname},</p>
            <p>Your One-Time Password (OTP) is:</p>
            <h1>${otp}</h1>
            <p>This code expires in 5 minutes.</p>
        `,
        });

        console.log("Signup email sent:", emailResponse);
        return res.json({ message: "OTP sent to your email!" });
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ message: "Error creating user or sending OTP" });
    }
};

// ----------------------
// VERIFY OTP (signup)
// ----------------------
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const stored = otpStore[email];

        if (!stored) {
            return res.status(400).json({ error: "No OTP request found for this email." });
        }

        if (stored.type !== "signup") {
            return res.status(400).json({ error: "Invalid OTP type for this request." });
        }

        if (Date.now() > stored.expires) {
            delete otpStore[email];
            return res.status(400).json({ error: "OTP expired. Please request a new one." });
        }

        if (String(stored.otp) !== String(otp)) {
            return res.status(400).json({ error: "Invalid OTP. Please try again." });
        }

        const { firstname, lastname, contactnumber, birthday, email: storedEmail, username, address, password } = stored.data;

        // Insert user into the database
        await db.query(
            `INSERT INTO users (firstname, lastname, contactnumber, birthday, email, username, address, password) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [firstname, lastname, contactnumber, birthday, storedEmail, username, address, password]
        );

        delete otpStore[email];
        res.json({ message: "OTP verified successfully. You can now reset your password." });
    } catch (err) {
        console.error("Verify OTP error:", err);
        res.status(500).json({ error: "Error verifying OTP." });
    }
};

// ----------------------
// RESEND OTP
// ----------------------
export const resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const stored = otpStore[email];
        if (!stored) {
        return res.status(400).json({ error: "No existing signup session found. Please sign up again." });
        }

        // only allow resending for the same type
        const newOtp = Math.floor(100000 + Math.random() * 900000);
        stored.otp = newOtp;
        stored.expires = Date.now() + 5 * 60 * 1000;

        // greet name safely if present
        const firstname = stored.data?.firstname || "";

        const response = await resend.emails.send({
        from: process.env.EMAIL_FROM || "WhiskerWatch <onboarding@resend.dev>",
        to: email,
        subject: "WhiskerWatch - Resent OTP Verification Code",
        html: `
            <p>Hi ${firstname}</p>
            <p>Your new One-Time Password (OTP) is:</p>
            <h1>${newOtp}</h1>
            <p>Please enter this code to complete your account verification process.</p>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this, please ignore this message and never share it with anyone to keep your WhiskerWatch account safe.</p>
            <p>Thanks for helping keep our cat community secure!</p>
            <strong>- WhiskerWatch Team</strong>
        `,
        });

        console.log("Resent OTP email:", response);
        return res.json({ message: "New OTP sent to your email!" });
    } catch (err) {
        console.error("Resend OTP error:", err);
        return res.status(500).json({ error: "Failed to resend OTP" });
    }
};

// ----------------------
// FORGOT PASSWORD
// ----------------------
// export const forgotPassword = async (req, res) => {
//     const db = getDB();
//     const { email } = req.body;

//     try {
//         const [userRows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
//         if (userRows.length === 0) {
//         return res.status(404).json({ error: "No account found with this email." });
//         }

//         const generatedOtp = Math.floor(100000 + Math.random() * 900000);
//         otpStore[email] = {
//         otp: generatedOtp,
//         type: "password_reset",
//         expires: Date.now() + 5 * 60 * 1000,
//         };

//         // safe destructure from the row
//         const { firstname = "", lastname = "" } = userRows[0];

//         const response = await resend.emails.send({
//         from: process.env.EMAIL_FROM || "WhiskerWatch <noreply@whiskerwatch.site>",
//         to: email,
//         subject: "WhiskerWatch Password Reset",
//         html: `
//             <h2>Password Reset Request</h2>
//             <p>Hi ${firstname} ${lastname}</p>
//             <p>Your One-Time Password (OTP) is:</p>
//             <h1>${generatedOtp}</h1>
//             <p>Please enter this code to continue your password reset request.</p>
//             <p>This code will expire in 5 minutes.</p>
//             <p>If you didn't request this, please ignore this message and never share it with anyone to keep your WhiskerWatch account safe.</p>
//             <p>Thanks for helping keep our cat community secure!</p>
//             <strong>- WhiskerWatch Team</strong>
//         `,
//         });

//         console.log("Forgot password email sent:", response);
//         return res.json({ message: "OTP sent to your email for password reset." });
//     } catch (err) {
//         console.error("Forgot password error:", err);
//         return res.status(500).json({ error: "Error sending OTP for password reset." });
//     }
// };
export const forgotPassword = async (req, res) => {
    const db = getDB();
    const { email } = req.body;

    try {
        // Check if user exists
        const [user] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
        if (user.length === 0) {
        return res.status(404).json({ error: "No account found with this email." });
        }

        // Generate OTP
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Store as string to match varchar(255)

        // Calculate expiration (5 minutes from now)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

        // Store OTP in user_otps table
        await db.query(
        `INSERT INTO user_otps (email, otp, expires_at, is_used) VALUES (?, ?, ?, ?)`,
        [email, generatedOtp, expiresAt, 0]
        );

        // Send OTP email
        const response = await resend.emails.send({
        from: process.env.EMAIL_FROM || "WhiskerWatch <noreply@whiskerwatch.site>",
        to: email,
        subject: "WhiskerWatch Password Reset OTP",
        html: `
            <h2>WhiskerWatch Password Reset</h2>
            <p>Hi, you One-Time Password (OTP) is:</p>
            <h1>${generatedOtp}</h1>
            <p>Here is your One-Time Password (OTP) to reset your password:</p>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this, please ignore this message and never share it with anyone to keep your WhiskerWatch account safe.</p>
            <p>Thanks for helping keep our cat community secure!</p>
            <p><strong>- WhiskerWatch Team</strong></p>
        `,
        });

        console.log("Forgot password email response:", response);
        res.json({ message: "OTP sent to your email for password reset." });
    } catch (err) {
        console.error("Forgot password error:", err);
        return res.status(500).json({ error: "Error sending OTP for password reset." });
    }
};

// ----------------------
// RESET PASSWORD
// ----------------------
export const resetPassword = async (req, res) => {
    const db = getDB();
    const { email, otp, password } = req.body; // Match frontend payload (password, not newPassword)

    try {
        // Fetch the latest OTP (used or unused) for the email, as long as it’s not expired
        const [stored] = await db.query(
            `SELECT * FROM user_otps WHERE email = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1`,
            [email]
        );
        if (stored.length === 0) {
        return res.status(400).json({ error: "No valid OTP found for this email." });
        }

        if (otp !== stored[0].otp) { // Compare as strings since otp is varchar(255)
        return res.status(400).json({ error: "Invalid OTP. Please try again." });
        }

        // Ensure OTP was verified (is_used = 1) to maintain security
        if (stored[0].is_used !== 1) {
        return res.status(400).json({ error: "OTP has not been verified. Please verify the OTP first." });
        }

        // Hash and update password
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(`UPDATE users SET password = ? WHERE email = ?`, [hashedPassword, email]);

        // Clean up OTP (optional: you could keep it for logging, but this prevents reuse)
        await db.query(`DELETE FROM user_otps WHERE otp_id = ?`, [stored[0].otp_id]);

        return res.json({ message: "Password has been reset successfully." });
    } catch (err) {
        console.error("Reset password error:", err);
        return res.status(500).json({ error: "Error resetting password." });
    }
};

// ----------------------
// VERIFY RESET OTP
// (used by frontend to check OTP before showing new-password UI)
// ----------------------
export const verifyResetOtp = async (req, res) => {
    const db = getDB();
    const { email, otp } = req.body;

    try {
        // Fetch the latest non-used, non-expired OTP for the email
        const [stored] = await db.query(
        `SELECT * FROM user_otps WHERE email = ? AND is_used = 0 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1`,
        [email]
        );
        if (stored.length === 0) {
        return res.status(400).json({ message: "No valid OTP found. Please request again." });
        }

        if (otp !== stored[0].otp) { // Compare as strings since otp is varchar(255)
        return res.status(400).json({ message: "Invalid OTP. Please try again." });
        }

        // Optionally mark OTP as used to prevent reuse in verification step
        await db.query(`UPDATE user_otps SET is_used = 1, used_at = NOW() WHERE otp_id = ?`, [stored[0].otp_id]);

        return res.status(200).json({ message: "OTP verified successfully!" });
    } catch (err) {
        console.error("Reset OTP verification error:", err);
        return res.status(500).json({ message: "Error verifying OTP" });
    }
};

export default otpRoute;
