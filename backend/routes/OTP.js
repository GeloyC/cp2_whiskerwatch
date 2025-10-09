import express from "express";
import cors from "cors";
import { Router } from "express";
import {getDB} from "../database.js"
import cookieParser from 'cookie-parser';
import session from "express-session";
import nodemailer from 'nodemailer';


const otpRoute = express();
otpRoute.use(express.json());


// Generates OTP - super straight forward 
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendMail(to, subject, html) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your provider like 'SendGrid', 'Mailgun', etc.
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    return transporter.sendMail({
        from: `"Whisker Watch " <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });
}

// Route for OTP 
otpRoute.post('/send_otp', async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    const db = getDB();

    // expires in 5 minutes
    const expiration = new Date(Date.now() + 5 * 60000); 


    try {
        await db.query (`
        INSERT INTO user_otps (email, otp, expires_at)
        VALUES (?, ?, ?)
        `, [email, otp, expiration]);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'WhiskerWatch generated OTP',
        text: `Thank you for signing up to WhiskerWatch, please use this OTP ${otp} to verify your email. Thank you!`
        });


        res.json({message: 'Succesfully sent OTP.'});

    } catch (err) {
        console.error('Error sending OTP: ', err);
        res.status(500).json({message: 'Error sending OTP!'});
    }
});


export async function validateOtp(email, otp)  {
    const db = getDB();

    // const { email, otp } = req.body;

    try {
        const [rows] = await db.query(`
            SELECT * FROM user_otps 
            WHERE email = ? AND otp = ? AND is_used = FALSE
            ORDER BY created_at   
            DESC LIMIT 1 
        `, 
        [email, otp]);

        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'The OTP you entered is invalid!'
            });
        }

        const record = rows[0];
        const time_now = new Date();

        if (time_now > record.expiration) {
            return res.status(400).json({
                success: false,
                message: 'The OTP you entered is already expired.'
            });
        }

        await db.query(`
            UPDATE user_otps SET is_used = TRUE
            WHERE otp_id = ?
        `, [record.otp_id]);

        return { success: true }

    } catch (err) {
        console.error('Error handling OTP verification: ', err);
        return { success: false, error: 'Server error during OTP validation!' }
    }
};


export default otpRoute;