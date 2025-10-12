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
    const db = getDB();

    try {
        const stored = otpStore[email];
        if (!stored) return res.status(400).json({ error: "No OTP found. Please sign up again." });

        // ensure this OTP was created for signup flow
        if (stored.type !== "signup") {
        return res.status(400).json({ error: "OTP type mismatch. This OTP is not for account signup." });
        }

        if (Date.now() > stored.expires) {
        delete otpStore[email];
        return res.status(400).json({ error: "OTP expired. Please request a new one." });
        }

        if (parseInt(otp, 10) !== stored.otp) {
        return res.status(400).json({ error: "Invalid OTP. Please try again." });
        }

        // OTP correct — save user to database
        const { firstname, lastname, contactnumber, birthday, username, address, password } = stored.data;
        await db.query(
        `INSERT INTO users (firstname, lastname, contactnumber, birthday, email, username, address, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [firstname, lastname, contactnumber, birthday, email, username, address, password]
        );

        delete otpStore[email]; // cleanup
        return res.json({ message: "Email verified and account created successfully!" });
    } catch (err) {
        console.error("Verify OTP error:", err);
        return res.status(500).json({ error: "Error verifying OTP" });
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
export const forgotPassword = async (req, res) => {
    const db = getDB();
    const { email } = req.body;

    try {
        const [userRows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
        if (userRows.length === 0) {
        return res.status(404).json({ error: "No account found with this email." });
        }

        const generatedOtp = Math.floor(100000 + Math.random() * 900000);
        otpStore[email] = {
        otp: generatedOtp,
        type: "password_reset",
        expires: Date.now() + 5 * 60 * 1000,
        };

        // safe destructure from the row
        const { firstname = "", lastname = "" } = userRows[0];

        const response = await resend.emails.send({
        from: process.env.EMAIL_FROM || "WhiskerWatch <noreply@whiskerwatch.site>",
        to: email,
        subject: "WhiskerWatch Password Reset",
        html: `
            <h2>Password Reset Request</h2>
            <p>Hi ${firstname} ${lastname}</p>
            <p>Your One-Time Password (OTP) is:</p>
            <h1>${generatedOtp}</h1>
            <p>Please enter this code to continue your password reset request.</p>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this, please ignore this message and never share it with anyone to keep your WhiskerWatch account safe.</p>
            <p>Thanks for helping keep our cat community secure!</p>
            <strong>- WhiskerWatch Team</strong>
        `,
        });

        console.log("Forgot password email sent:", response);
        return res.json({ message: "OTP sent to your email for password reset." });
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
    // client should send newPassword (not 'password') to match your frontend naming if you use newPassword
    const { email, otp, newPassword } = req.body;

    try {
        const stored = otpStore[email];
        if (!stored || stored.type !== "password_reset") {
        return res.status(400).json({ error: "No valid OTP found for this email." });
        }

        if (Date.now() > stored.expires) {
        delete otpStore[email];
        return res.status(400).json({ error: "OTP expired. Please request a new one." });
        }

        if (parseInt(otp, 10) !== stored.otp) {
        return res.status(400).json({ error: "Invalid OTP. Please try again." });
        }

        // hash and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query(`UPDATE users SET password = ? WHERE email = ?`, [hashedPassword, email]);

        delete otpStore[email];
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
    const { email, otp } = req.body;

    try {
        const stored = otpStore[email];
        if (!stored) return res.status(400).json({ message: "No OTP found. Please request again." });

        if (Date.now() > stored.expires) {
        delete otpStore[email];
        return res.status(400).json({ message: "OTP expired. Please request a new one." });
        }

        if (parseInt(otp, 10) !== stored.otp) {
        return res.status(400).json({ message: "Invalid OTP. Please try again." });
        }

        return res.status(200).json({ message: "OTP verified successfully!" });
    } catch (err) {
        console.error("Reset OTP verification error:", err);
        return res.status(500).json({ message: "Error verifying OTP" });
    }
};

export default otpRoute;
