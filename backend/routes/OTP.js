import express from "express";
import cors from "cors";
import { Router } from "express";
import {getDB} from "../database.js"
import cookieParser from 'cookie-parser';
import session from "express-session";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';


const otpRoute = express();
otpRoute.use(express.json());
// dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
let otpStore = {};

export const signupUser = async (req, res) => {
    const db = getDB();
    const { firstname, lastname, contactnumber, birthday, email, username, address, password } = req.body;

    try {
        // Check if email or username exists
        const [existing] = await db.query(`SELECT * FROM users WHERE email = ? OR username = ?`, [email, username]);
        if (existing.length > 0) {
        return res.status(409).json({ message: "Email or Username already exists" });
        }

        // Hash password but don't save yet
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[email] = { otp, data: { firstname, lastname, contactnumber, birthday, email, username, address, password: hashedPassword }, expires: Date.now() + 5 * 60 * 1000 };

        // Send OTP via Resend
        const emailResponse = await resend.emails.send({
        
        
        from: process.env.EMAIL_FROM || "WhiskerWatch <onboarding@resend.dev>",
        // from:"WhiskerWatch <noreply@whiskerwatch.site>",
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

        console.log("This is Resend email response: ", emailResponse);
        console.log("Received signup from:", email);

        res.json({ message: "OTP sent to your email!" });

    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Error creating user or sending OTP" });
    }
};



export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const db = getDB();

    try {
        const stored = otpStore[email];
        if (!stored) return res.status(400).json({ error: "No OTP found. Please sign up again." });

        if (Date.now() > stored.expires) {
            delete otpStore[email];
            return res.status(400).json({ error: "OTP expired. Please request a new one." });
        }

        if (parseInt(otp) !== stored.otp) {
            return res.status(400).json({ error: "Invalid OTP. Please try again." });
        }

        // OTP correct — save user to database
        const { firstname, lastname, contactnumber, birthday, username, address, password } = stored.data;

        await db.query(
            `INSERT INTO users (firstname, lastname, contactnumber, birthday, email, username, address, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [firstname, lastname, contactnumber, birthday, email, username, address, password]
        );

        delete otpStore[email]; // cleanup
        res.json({ message: "Email verified and account created successfully!" });
    } catch (err) {
        console.error("Verify OTP error:", err);
        res.status(500).json({ error: "Error verifying OTP" });
    }
};


//  RESEND OTP
export const resendOtp = async (req, res) => {
    const { email } = req.body;
    const db = getDB();

    try {
        // Check if OTP exists for this email
        const stored = otpStore[email];
        if (!stored) {
        return res.status(400).json({ error: "No existing signup session found. Please sign up again." });
        }

        // Generate a new OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000);
        otpStore[email].otp = newOtp;
        otpStore[email].expires = Date.now() + 5 * 60 * 1000; // Reset expiration time

        // Send via Resend
        const { firstname } = stored.data;
        const response = await resend.emails.send({
        from: process.env.EMAIL_FROM || "WhiskerWatch <onboarding@resend.dev>",
        // from: "WhiskerWatch <onboarding@resend.dev>",
        to: email,
        subject: "WhiskerWatch - Resent OTP Verification Code",
        html: `
            <h2>New OTP Verification</h2>
            <p>Hi ${firstname},</p>
            <p>Your new One-Time Password (OTP) is:</p>
            <h1>${newOtp}</h1>
            <p>This code expires in 5 minutes.</p>
        `,
        });

        console.log("Resend email response:", response);
        res.json({ message: "New OTP sent to your email!" });

    } catch (err) {
        console.error("Resend OTP error:", err);
        res.status(500).json({ error: "Failed to resend OTP" });
    }
};


export default otpRoute;