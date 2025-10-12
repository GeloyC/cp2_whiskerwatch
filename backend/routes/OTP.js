import express from "express";
import cors from "cors";
import { Router } from "express";
import {getDB} from "../database.js"
import cookieParser from 'cookie-parser';
import session from "express-session";
import nodemailer from 'nodemailer';

import { hash, randomBytes } from 'crypto';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcrypt';


const otpRoute = express();
otpRoute.use(express.json());
// dotenv.config();


// export const sendMail = async (to, subject, html) => {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail', // or your email service
//         auth: {
//         user: process.env.EMAIL_USER, // Set in Render environment
//         pass: process.env.EMAIL_PASS, // Set in Render environment
//         },
//     });

//     await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to,
//         subject,
//         html,
//     });
// };

// const mg = mailgun({
//     apiKey: process.env.MAILGUN_API_KEY,
//     domain: process.env.MAILGUN_DOMAIN
// });

// const otpStore = new Map();

// const otpLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 5,
//     message: 'Too many OTP requests, please try again later.'
// });


// otpRoute.post('/generate_otp', otpLimiter, async (req, res) => {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ error: 'Email is required!' });

//     const otp = randomBytes(3).toString('hex').toUpperCase();

//     const hashedOtp = await bcrypt.hash(otp, 10);

//     const expiresAt = Date.now() + (process.env.OTP_EXPIRATION_MINUTES * 60 * 1000);
//     otpStore.set( email, { hashedOtp, expiresAt });

//     const data = {
//         from: 'WhiskerWatch OTP <noreply@whiskerwatch.site>',
//         to: email,
//         subject: 'Your OTP code',
//         text: `This is your One-time password: ${otp}. It expires in ${process.env.OTP_EXPIRATION_MINUTES} minutes.`,
//         html: `<h1>Your OTP Code</h1><p><strong>${otp}</strong> (expires in ${process.env.OTP_EXPIRATION_MINUTES} minutes).</p>`
//     };

//     try {
//         await mg.messages().send(data);
//         res.status(200).json({ message: `OTP sent to your email.` });
//     } catch (error) {
//         console.error('Error sending OTP: ', error);
//         res.status(500).json({ error: `Failed to send OTP` });
//     }
// });

export default otpRoute;