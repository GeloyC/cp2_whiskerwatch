import express from "express";
import cors from "cors";
import { Router } from "express";
import {getDB} from "../database.js"
import cookieParser from 'cookie-parser';
import session from "express-session";
import nodemailer from 'nodemailer';


const otpRoute = express();
otpRoute.use(express.json());




export const sendMail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your email service
        auth: {
        user: process.env.EMAIL_USER, // Set in Render environment
        pass: process.env.EMAIL_PASS, // Set in Render environment
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
};


export default otpRoute;