import express from "express";
import cors from "cors";
import { Router } from "express";
import { getDB } from "../database.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";

import axios from 'axios';

import multer from 'multer';
import fs from 'fs';
// import { promises as fs } from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { error, log } from "console";

import nodemailer from 'nodemailer';
import { sendMail } from "./OTP.js";

const UserRoute = Router();
UserRoute.use(express.json());
UserRoute.use(cookieParser());



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


UserRoute.use('/FileUploads', express.static(path.join(__dirname, 'FileUploads')));



const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const dir = path.join(process.cwd(), "FileUploads")
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        } 
        callback(null, dir);
    },
    
    // PURPOSE: Upload pdf files
    // const upload = multer({ storage, fileFilter });
    
    
    filename: function (req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname));
    },
});

const adoptionFormStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        const dir = path.join(process.cwd(), "FileUploads/adoption_form")
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        } 
        callback(null, dir);
    },
    
    // PURPOSE: Upload pdf files
    // const upload = multer({ storage, fileFilter });
    
    
    filename: function (req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname));
    },
});


const upload = multer({
  storage,
  fileFilter: function(req, file, callback) {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'application/pdf' 
    ) {
      callback(null, true)
    } else {
      req.err = 'File is invalid!'
      // callback(null, false)

      if (!req.invalidFiles) req.invalidFiles = [];
      req.invalidFiles.push(file.originalname);
      callback(null, false);
    };
  },
});

const uploadAdoptionForm = multer({
  storage: adoptionFormStorage, 
  fileFilter: function(req, file, callback) {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'application/pdf' 
    ) {
      callback(null, true);
    } else {
      req.err = 'File is invalid!';
      if (!req.invalidFiles) req.invalidFiles = [];
      req.invalidFiles.push(file.originalname);
      callback(null, false);
    }
  },
});


// to persist user data per refresh
// add this to render.com env variable later
const JWT_SECRET = process.env.JWT_SECRET || 'whisker_secret'; 



// UserRoute.post('/signup', async (req, res) => {
//   let db = getDB();
//   try {
//     const { firstname, lastname, contactnumber, birthday, email, username, address, password, otp } = req.body;

//     // Validate OTP
//     // const otpResult = await validateOtp(email, otp);
//     // if (!otpResult.success) {
//     //   return res.status(400).json({ message: otpResult.message || 'OTP validation failed.' });
//     // }

//     const captchaResponse = await axios.post(
//       `https://www.google.com/recaptcha/api/siteverify`,
//       null,
//       {
//         params: {
//           secret: process.env.RECAPTCHA_SECRET_KEY, // Your Secret Key from Google reCAPTCHA
//           response: captchaToken, // Token from frontend
//           remoteip: req.ip, // Optional: Client IP for added security
//         },
//       }
//     );

//     if (!captchaResponse.data.success || captchaResponse.data.score < 0.5) {
//       return res.status(400).json({ message: 'CAPTCHA verification failed. Are you a bot?' });
//     }

//     // Check for existing email
//     const [existingUsers] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
//     if (existingUsers.length > 0) {
//       return res.status(400).json({ message: 'Email already registered.' });
//     }

//     // Hash password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Insert user
//     const [result] = await db.query(
//       `INSERT INTO users 
//       (firstname, lastname, contactnumber, birthday, email, username, address, password, role, badge) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'regular', 'Toe Bean Trainee')`,
//       [firstname, lastname, contactnumber, birthday, email, username, address, hashedPassword]
//     );

//     // Send welcome email (optional)
//     await sendMail(
//       email,
//       'Welcome to Whisker Watch',
//       `
//         <h3>Welcome to Whisker Watch!</h3>
//         <p>Thank you for joining, ${firstname} ${lastname}! Your account is now active.</p>
//         <p>Start exploring and supporting our feline friends!</p>
//         <p><strong>Whisker Watch Team</strong></p>
//       `
//     );

//     res.status(200).json({
//       message: 'Account created!',
//       newUser: {
//         user_id: result.insertId,
//         role: 'regular',
//         badge: 'Toe Bean Trainee',
//       },
//     });
//   } catch (err) {
//     console.error('Sign up error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

UserRoute.post('/signup', async (req, res) => {
  let db = getDB();
  try {
    const { firstname, lastname, contactnumber, birthday, email, username, address, password, 'g-recaptcha-response': captchaToken } = req.body;

    console.log('Received Request Body:', req.body);
    console.log('RECAPTCHA_SECRET_KEY:', process.env.RECAPTCHA_SECRET_KEY);
    console.log('Received captchaToken:', captchaToken);

    // Verify reCAPTCHA
    let captchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY, // Your Secret Key from Google reCAPTCHA
          response: captchaToken, // Token from frontend
          remoteip: req.ip, // Optional: Client IP for added security
        },
      }
    );

    console.log('Google reCAPTCHA Response:', captchaResponse.data);
    if (!captchaResponse.data.success || captchaResponse.data.score < 0.3) {
      return res.status(400).json({ message: 'CAPTCHA verification failed. Are you a bot?' });
    }

    // Check for existing email
    const [existingUsers] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const [result] = await db.query(
      `INSERT INTO users 
      (firstname, lastname, contactnumber, birthday, email, username, address, password, role, badge) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'regular', 'Toe Bean Trainee')`,
      [firstname, lastname, contactnumber, birthday, email, username, address, hashedPassword]
    );

    // Send welcome email (optional)
    // await sendMail(
    //   email,
    //   'Welcome to Whisker Watch',
    //   `
    //     <h3>Welcome to Whisker Watch!</h3>
    //     <p>Thank you for joining, ${firstname} ${lastname}! Your account is now active.</p>
    //     <p>Start exploring and supporting our feline friends!</p>
    //     <p><strong>Whisker Watch Team</strong></p>
    //   `
    // );

    res.status(200).json({
      message: 'Account created!',
      newUser: {
        user_id: result.insertId,
        role: 'regular',
        badge: 'Toe Bean Trainee',
      },
    });
  } catch (err) {
    console.error('Sign up error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


UserRoute.post('/check_email', async (req, res) => {
  const db = getDB();
  const { email } = req.body;

  try {
    const [rows] = await db.query( `
      SELECT user_id FROM users WHERE email = ?
    `, [email]);

    if (rows.length > 0) {
        return res.status(409).json({ success: false, message: 'An account with this email address already exist.' });
    }

    res.status(200).json({ success: true, message: 'Email is available' });
  } catch (err) {
      console.error('Email already exist: ', err);
      res.status(500).json({ success: false, message: 'Server error.' })
  }
});

UserRoute.post('/check_username', async (req, res) => {
  const db = getDB();
  const { username } = req.body;

  try {
    const [rows] = await db.query( `
      SELECT user_id FROM users WHERE username = ?
    `, [username]);

    if (rows.length > 0) {
        return res.status(409).json({ success: false, message: 'An account with this username address already exist.' });
    }

    res.status(200).json({ success: true, message: 'Username is available' });
  } catch (err) {
      console.error('Username already exist: ', err);
      res.status(500).json({ success: false, message: 'Server error.' })
  }
});



UserRoute.post("/login", async (req, res) => {
  const db = getDB();
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("Login attempt for email:", email);

    const payload = {
      user_id: user.user_id,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });


    res.cookie("token", token, {
      httpOnly: false,
      secure: false, // Temporarily disable for local/Render testing without HTTPS
      sameSite: 'lax', // Use 'lax' for testing, switch to 'none' with secure: true later
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful!",
      user: payload,
      token: token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ err: "Internal server error" });
  }
});

// UserRoute.post('/reset_password', async (req, res) => {
//   const db = getDB();
//   const { password, email, otp } = req.body;

//   if (!email || !password || !otp) {
//     return res.status(400).json({ success: false, message: 'Email, password and OTP are required.' });
//   }

//   try {
//     const otp_result = await validateOtp(email, otp);

//     if (!otp_result.success) {
//       return res.status(400).json({ success: false, message: otp_result.message || 'OTP validation failed.' });
//     }

//     const [result] = await db.query(`
//       UPDATE users SET password = ?
//       WHERE email = ?
//     `, [password, email]);

//     await sendMail(
//       email, 
//       'Password reset confirmation', 
//       `
//         <h3>Password Reset Successful</h3>
//         <p>Your password has been successfully reset on Whisker Watch.</p>
//         <p>If you did not request this, please contact support immediately.</p>
//         <br>
//         <p>🐾 Stay safe,</p>
//         <p><strong>Whisker Watch Team</strong></p>
//       `
//     );

//     res.status(200).json({ success: true, message: 'Password reset successfully.' });
//   } catch (err) {
//     console.error(err);
//   }
// });



// UserRoute.get('/api/session', async (req, res) => {
//   if (!req.session.user) {
//     return res.json({ loggedIn: false, user: null });
//   }

//   const db = getDB();
//   const { user_id } = req.session.user;

//   try {
//     const [rows] = await db.query(`
//       SELECT user_id, firstname, lastname, role 
//       FROM users 
//       WHERE user_id = ?`,
//       [user_id]
//     );

//     const user = rows[0];

//     // keep session in sync (optional)
//     req.session.user = user;

//     res.json({ loggedIn: true, user });
//   } catch (err) {
//     console.error('Session fetch error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// UserRoute.post('/reset_password', async (req, res) => {
//   const db = getDB();
//   const { password, email, otp } = req.body;

//   if (!email || !password || !otp) {
//     return res.status(400).json({ success: false, message: 'Email, password, and OTP are required.' });
//   }

//   try {
//     const otpResult = await validateOtp(email, otp);
//     if (!otpResult.success) {
//       return res.status(400).json({ success: false, message: otpResult.message || 'OTP validation failed.' });
//     }

//     // Hash the new password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Update password
//     const [result] = await db.query(
//       `UPDATE users SET password = ? WHERE email = ?`,
//       [hashedPassword, email]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: 'User not found or email mismatch.' });
//     }

//     // Send confirmation email
//     await sendMail(
//       email,
//       'Password Reset Confirmation',
//       `
//         <h3>Password Reset Successful</h3>
//         <p>Your password has been successfully reset on Whisker Watch.</p>
//         <p>If you did not request this, please contact support immediately.</p>
//         <br>
//         <p>🐾 Stay safe,</p>
//         <p><strong>Whisker Watch Team</strong></p>
//       `
//     );

//     res.status(200).json({ success: true, message: 'Password reset successfully.' });
//   } catch (err) {
//     console.error('Reset password error:', err);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

UserRoute.post('/reset_password', async (req, res) => {
  const db = getDB();
  const { password, email, 'g-recaptcha-response': captchaToken } = req.body;

  // Validate required fields
  if (!email || !password || !captchaToken) {
    return res.status(400).json({ success: false, message: 'Email, password, and CAPTCHA are required.' });
  }

  try {
    // Verify reCAPTCHA
    const captchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY, // Your Secret Key from Google reCAPTCHA
          response: captchaToken,
          remoteip: req.ip,
        },
      }
    );
    console.log('Google reCAPTCHA Response:', captchaResponse.data);

    if (!captchaResponse.data.success || captchaResponse.data.score < 0.5) {
      return res.status(400).json({ success: false, message: 'CAPTCHA verification failed. Are you a bot?' });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password
    const [result] = await db.query(
      `UPDATE users SET password = ? WHERE email = ?`,
      [hashedPassword, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found or email mismatch.' });
    }

    // Send confirmation email
    await sendMail(
      email,
      'Password Reset Confirmation',
      `
        <h3>Password Reset Successful</h3>
        <p>Your password has been successfully reset on Whisker Watch.</p>
        <p>If you did not request this, please contact support immediately.</p>
        <br>
        <p>🐾 Stay safe,</p>
        <p><strong>Whisker Watch Team</strong></p>
      `
    );

    res.status(200).json({ success: true, message: 'Password reset successfully.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


UserRoute.get("/api/session", (req, res) => {
  const token = req.cookies.token  || req.headers.authorization?.split(" ")[1];;
  if (!token) return res.json({ loggedIn: false, user: null });

  try { 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ loggedIn: true, user:decoded });

  } catch (err) {
    console.error("Session error:", err);
    res.status(401).json({ loggedIn: false, user: null });
  }
});


export const verifyUser = (req, res, next) => {
  const token = req.cookies.token; // read JWT cookie
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded user info to req.user
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};


UserRoute.get('/logged', async (req, res) => {
    let db = getDB();
    try {
        const userId = req.query.user_id;
        
        if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
        }
        
        const [data] = await db.query(
        'SELECT user_id, firstname, lastname, role FROM users WHERE user_id = ?', [userId]
        );
        
        if (data.length === 0) {
        return res.status(404).json({ error: 'User not found' });
        }
        
        return res.status(200).json(data[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});


UserRoute.post("/adminlogin", async (req, res) => {
  const db = getDB();

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials!" });
    }

    const user = rows[0];


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials!" });
    }


    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const payload = {
      user_id: user.user_id,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      profile_image: user.profile_image || null,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.cookie('token', token, {
      httpOnly: true, // Enable httpOnly for security
      secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Adjust based on environment
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Admin login successful",
      user: payload,
    });

  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// UserRoute.get('/profile', async (req, res) => {
//     let db = getDB();
//     try {
//         // const sessionUser = req.session.user;

//         const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
//         if (!token) {
//           return res.status(401).json({ error: 'Please login to view your profile.' });
//         }

//         let decoded;
//         try {
//           decoded = jwt.verify(token, JWT_SECRET);
//         } catch (err) {
//           return res.status(401).json({ error: 'Invalid or expired token.' });
//         }

//         // if (!sessionUser || !sessionUser.user_id) {
//         //     return res.status(401).json({ error: 'Please login to submit application.' });
//         // }

//         const user_id = decoded.user_id;
//         console.log('Authenticated user ID:', user_id);

//         // Step 3: Query the database
//         const [userprofile] = await db.query(
//             `SELECT 
//                 user_id, firstname, lastname, profile_image, contactnumber,
//                 DATE_FORMAT(birthday, '%Y-%m-%d') AS birthday,
//                 email, username, role, badge, address,
//                 DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
//                 DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at 
//             FROM users
//             WHERE user_id = ?;`,
//             [user_id]
//         );

//         // Step 4: Handle if user not found
//         if (!userprofile.length) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Step 5: Return user profile
//         return res.json(userprofile[0]);

//     } catch (err) {
//         console.error('Error fetching user data:', err);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// });


UserRoute.get('/profile', async (req, res) => {
  let db = getDB();
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Please login to view your profile.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Use env variable
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    const user_id = decoded.user_id;
    console.log('Authenticated user ID:', user_id);

    // Query the database
    const [userprofile] = await db.query(
      `SELECT 
        user_id, firstname, lastname, profile_image, contactnumber,
        DATE_FORMAT(birthday, '%Y-%m-%d') AS birthday,
        email, username, role, badge, address,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at 
      FROM users
      WHERE user_id = ?`,
      [user_id]
    );

    // Handle if user not found
    if (!userprofile.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user profile
    return res.json(userprofile[0]);
  } catch (err) {
    console.error('Error fetching user data:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


UserRoute.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/', // Ensure the cookie is cleared for the root path
  });

  res.json({ message: 'Logged out successfully!' });
});



// UserRoute.patch('/profile/update', upload.single('profile_image'), async (req, res) => {
//     const db = getDB();
//     const {
//         firstname = '',
//         lastname = '',
//         address = '',
//         email = '',
//         birthday = '',
//         profile_image = '',  // assume this is the new filename
//         old_image = ''       // send this from frontend when uploading new image
//     } = req.body;

//     const newImage = req.file ? req.file.filename : null;
//     try {
//         const sessionUser = req.session.user;

//         if (!sessionUser || !sessionUser.user_id) {
//             console.log('No session user found');
//             return res.status(401).json({ error: 'User not authenticated (no session)' });
//         }

//         console.log('Updating profile for user ID:', sessionUser.user_id);

//         // 1. Remove old image if a new one is uploaded
//         if (newImage && old_image && old_image !== newImage) {
//             const filePath = path.join(__dirname, 'FileUploads', old_image);
//             try {
//                 fs.unlink(filePath);
//                 console.log(`Deleted old image: ${old_image}`);
//             } catch (err) {
//                 if (err.code !== 'ENOENT') {
//                 console.error(`Error deleting file: ${old_image}`, err);
//                 }
//             }
//         }

//         // 2. Update user info
//         const [update] = await db.query(`
//             UPDATE users SET
//                 firstname = ?,
//                 lastname = ?,
//                 address = ?,
//                 email = ?,
//                 birthday = ?,
//                 profile_image = ?,
//                 updated_at = CURRENT_TIMESTAMP
//                 WHERE user_id = ?`,
//             [
//                 firstname, 
//                 lastname, 
//                 address, 
//                 email, 
//                 birthday, 
//                 newImage || old_image, 
//                 sessionUser.user_id
//             ]
//         );

//         if (update.affectedRows === 0) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const [updatedProfile] = await db.query(
//             `
//             SELECT 
//                 user_id, firstname, lastname, profile_image, contactnumber,
//                 DATE_FORMAT(birthday, '%Y-%m-%d') AS birthday,
//                 email, username, role, badge, address,
//                 DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
//                 DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at 
//             FROM users
//             WHERE user_id = ?`,
//             [sessionUser.user_id]
//         );

//         if (!updatedProfile.length) {
//         return res.status(404).json({ error: 'User not found after update' });
//         }

//         return res.status(200).json({
//             message: 'User profile updated successfully!',
//             profile_image: newImage || old_image  // return updated image filename
//         });

//     } catch (err) {
//         console.error('Error updating user profile: ', err);
//         return res.status(500).json({ error: 'Failed to update profile.' });
//     }
// });

UserRoute.patch('/profile/update', upload.single('profile_image'), async (req, res) => {
  const db = getDB();
  const {
    firstname = '',
    lastname = '',
    address = '',
    email = '',
    birthday = '',
    profile_image = '', // New filename from frontend
    old_image = '',    // Existing image filename from frontend
  } = req.body;

  const newImage = req.file ? req.file.filename : null;

  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'User not authenticated (no token)' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Use env variable
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    const user_id = decoded.user_id;
    console.log('Updating profile for user ID:', user_id);

    // Remove old image if a new one is uploaded
    if (newImage && old_image && old_image !== newImage) {
      const filePath = path.join(__dirname, 'FileUploads', old_image);
      try {
        fs.unlink(filePath);
        console.log(`Deleted old image: ${old_image}`);
      } catch (err) {
        if (err.code !== 'ENOENT') {
          console.error(`Error deleting file: ${old_image}`, err);
        }
      }
    }

    // Update user info
    const [update] = await db.query(
      `UPDATE users SET
        firstname = ?,
        lastname = ?,
        address = ?,
        email = ?,
        birthday = ?,
        profile_image = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?`,
      [
        firstname,
        lastname,
        address,
        email,
        birthday,
        newImage || old_image,
        user_id,
      ]
    );

    if (update.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [updatedProfile] = await db.query(
      `SELECT 
        user_id, firstname, lastname, profile_image, contactnumber,
        DATE_FORMAT(birthday, '%Y-%m-%d') AS birthday,
        email, username, role, badge, address,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at 
      FROM users
      WHERE user_id = ?`,
      [user_id]
    );

    if (!updatedProfile.length) {
      return res.status(404).json({ error: 'User not found after update' });
    }

    return res.status(200).json({
      message: 'User profile updated successfully!',
      profile_image: newImage || old_image, // Return updated image filename
    });
  } catch (err) {
    console.error('Error updating user profile:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});


UserRoute.get(`/all_users`, async (req, res) => {
  const db = getDB();

  try {
    const [users] = await db.query(`
      SELECT *
      FROM users
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE());  
    `);

    return res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ error: 'Failed to fetch Users.' });
  }
});

UserRoute.post('/feeding/form', upload.single('file'), async (req, res) => {
    const db = getDB();
    const { user_id } = req.body;
    const file = req.file;

    try {
        if (!file || !user_id) {
            return res.status(400).json({error: 'Missing data'});
        }

        const [existing] = await db.query(`
            SELECT * FROM volunteer_application
            WHERE user_id = ? AND status = 'Pending'    
        `, [user_id]);

        if (existing.length > 0) {
            return res.status(409).json({
                error: 'You already have a pending application. Please wait for it to be reviewed before submitting again.',
            });
        }

        // TODO: REMOVE EXPIRATION DATES
        const [activeVolunteer] = await db.query(`
            SELECT * FROM volunteer
            WHERE feeder_id = ? 
                AND status = 'Approved'
                AND feeding_date
        `, [user_id]);

        if (activeVolunteer.length > 0) {
            return res.status(409).json({
                error: 'You already have an approved volunteer application. Please wait until it expires before applying again.',
                
            });
        }

        let totalPointsEarned = 0;
        

        const feeding_form = file.filename;
        await db.query(`
            INSERT INTO volunteer_application
                (user_id, application_form)
                VALUES (?, ?)`,
                [user_id, feeding_form]
            );

        totalPointsEarned += 10;

        let message = `Your application form is submitted, please wait for approval. Thank you! `;
        await db.query(
            `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
            [user_id, message]
        );

        if (totalPointsEarned > 0) {
          // Check if user already has a whiskermeter entry
          const [rows] = await db.query(
            `SELECT points FROM whiskermeter WHERE user_id = ?`,
            [user_id]
          );

          if (rows.length > 0) {
            // Update existing points by adding earned points
            await db.query(
              `UPDATE whiskermeter SET points = points + ?, last_updated = CURRENT_TIMESTAMP WHERE user_id = ?`,
              [totalPointsEarned, user_id]
            );
          } else {
            // Insert new whiskermeter row
            await db.query(
              `INSERT INTO whiskermeter (user_id, points) VALUES (?, ?)`,
              [user_id, totalPointsEarned]
            );
          }

          const [[{ points }]] = await db.query(
            `SELECT points FROM whiskermeter WHERE user_id = ?`,
            [user_id]
          );

          let newBadge = 'Toe Bean Trainee';
          if (points >= 500) newBadge = 'The Catnip Captain';
          else if (points >= 300) newBadge = 'Meowtain Mover';
          else if (points >= 200) newBadge = 'Furmidable Friend';
          else if (points >= 100) newBadge = 'Snuggle Scout';

          await db.query(
            `UPDATE users SET badge = ? WHERE user_id = ?`,
            [newBadge, user_id]
          );
        }

        return res.json({ message: 'File uploaded and DB updated successfully.' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ err: 'Internal server error' });
    } 
})


UserRoute.post('/adoption/form', uploadAdoptionForm.single('file'), async (req, res) => {
    const db = getDB();
    const { user_id, cat_id } = req.body;
    const file = req.file;

    if (!file || !user_id || !cat_id) {
        return res.status(400).json({ message: 'Missing required fields or file.' });
    }

    try {
        const filename = file.filename;

        const [catRows] = await db.query(`
            SELECT adoption_status FROM cat WHERE cat_id = ?
        `, [cat_id]);

        if (catRows.length === 0) {
            return res.status(404).json({ message: 'Cat not found.' });
        }

        if (catRows[0].adoption_status !== 'Available') {
            return res.status(400).json({ message: 'This cat is no longer available for adoption.' });
        }

        // Check if a user has pending application
        const [userPending] = await db.query(`
            SELECT * FROM adoption_application
            WHERE user_id = ? AND cat_id = ? AND status = 'Pending';    
        `, [user_id, cat_id]);

        if (userPending.length > 0) {
            return res.status(409).json({ message: 'You already have a pending application for this cat.' });
        }

        // Check if a user already applied for the cat thus preventing other from trying to apply to the cat
        const [catPending] = await db.query(`
            SELECT * FROM adoption_application
            WHERE cat_id = ? AND status = 'Pending'
        `, [cat_id]);

        if (catPending.length > 0) {
            return res.status(409).json({ message: 'Another user already has a pending application for this cat.' });
        }

        // Insert into adoption_application table
        const [result] = await db.query(`
            INSERT INTO adoption_application (
                user_id,
                cat_id,
                application_form,
                status
            ) VALUES (?, ?, ?, 'Pending')
        `, [user_id, cat_id, filename]);

        return res.status(200).json({ message: 'Application submitted successfully.', application_id: result.insertId });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error occurred.' });
    }
});


// Post Request for Feeding Report
UserRoute.post('/feeding_report/:user_id', async (req, res) => {
  const db = getDB();
  const { report } = req.body;
  const { user_id } = req.params;
  let totalPointsEarned = 0;

  try {
    await db.query(`
      INSERT INTO feeding_report (user_id, report)
      VALUES (?, ?)
    `, [user_id, report]);

    totalPointsEarned += 10;

    if (totalPointsEarned > 0) {
      // Check if user already has a whiskermeter entry
      const [rows] = await db.query(
          `SELECT points FROM whiskermeter WHERE user_id = ?`,
          [user_id]
      );

      if (rows.length > 0) {
          // Update existing points by adding earned points
          await db.query(
          `UPDATE whiskermeter SET points = points + ?, last_updated = CURRENT_TIMESTAMP WHERE user_id = ?`,
          [totalPointsEarned, user_id]
          );
      } else {
          // Insert new whiskermeter row
          await db.query(
          `INSERT INTO whiskermeter (user_id, points) VALUES (?, ?)`,
          [user_id, totalPointsEarned]
          );
      }

      const [[{ points }]] = await db.query(
          `SELECT points FROM whiskermeter WHERE user_id = ?`,
          [user_id]
      );

      let newBadge = 'Toe Bean Trainee';
      if (points >= 500) newBadge = 'The Catnip Captain';
      else if (points >= 300) newBadge = 'Meowtain Mover';
      else if (points >= 200) newBadge = 'Furmidable Friend';
      else if (points >= 100) newBadge = 'Snuggle Scout';

      await db.query(
          `UPDATE users SET badge = ? WHERE user_id = ?`,
          [newBadge, user_id]
      );
    }

    let message = `Thank you for submitting your feeding report! Hope you got a wonderful experience!`;

    await db.query(
        `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
        [user_id, message]
    );
    
    return res.status(200).json({ message: 'Feeding report submitted successfully.'})

  } catch (err) {
    console.error('Failed to submit report: ', err);
    return res.status(500).json({ message: 'Server error occurred.' });
  }
})

// Get the report from all the users
UserRoute.get('/feeding_reports', async (req, res) => {
  const db = getDB();
  const user_id = req.body;

  try {
    const [rows] = await db.query(`
      SELECT 
        r.report_id,
        u.firstname, u.lastname, 
        r.report,
        DATE_FORMAT(r.created_at, '%m-%d-%Y') AS created_at
      FROM users AS u
      JOIN feeding_report AS r
      WHERE u.user_id = r.user_id;
    `);

    res.json(rows);

  } catch(err) {
    console.error('Error fetching reports:', err);
    return res.status(500).json({ error: 'Failed to fetch reports.' });
  }
});


UserRoute.get('/has_report/:user_id', async (req, res) => {
  const db = getDB();
  const { user_id } = req.params;
  try {
      const [report] = await db.query(
      `SELECT fr.*
      FROM feeding_report fr
      JOIN volunteer v ON fr.user_id = v.feeder_id
      WHERE fr.user_id = ?
      AND DATE(v.feeding_date) <= CURDATE()
      ORDER BY fr.created_at DESC
      LIMIT 1`,
      [user_id]
      );

      if (report) {
      res.json({ hasReport: true });
      } else {
      res.json({ hasReport: false });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
  }
});


// USER NOTIFICATION ENDPOINT

UserRoute.get('/notifications/:user_id', async (req, res) => {
  const db = getDB();
  const { user_id } = req.params;

  try {
    const [notifications] = await db.query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
      [user_id]
    );

    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

UserRoute.patch('/notifications/mark_read/:user_id', async (req, res) => {
  const db = getDB();
  const { user_id } = req.params;

  try {
    await db.query(`UPDATE notifications SET is_read = 1 WHERE notification_id = ?`, [user_id]);
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Error marking notification as read:', err); // <-- Add logging
    res.status(500).json({ message: 'Failed to update notification' });
  }
});



UserRoute.delete('/notifications/delete/:user_id', async (req, res) => {
  const db = getDB();
  const { user_id } = req.params;

  try {
    await db.query(`DELETE FROM notifications WHERE notification_id = ?`, [user_id]);
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    console.error('Error deleting notification:', err); // <-- Add logging
    res.status(500).json({ message: 'Failed to delete notification' });
  }
});




export default UserRoute;