// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from 'cookie-parser';

import { connectDB } from "./database.js"
import CatRoute from './routes/Cat.js'
import UserRoute from "./routes/User.js";
import AdminRoute from "./routes/Admin.js";
import WhiskerMeterRoute from "./routes/WhiskerMeter.js";
import DonationRoute from "./routes/Donation.js";
import HVAdoptionRoute from "./routes/AdoptionHV.js";
import otpRoute from "./routes/OTP.js";


import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';




dotenv.config();
const app = express();

// ---------------- PATH UTILS ---------------- //

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const allowedOrigins = [
  'http://localhost:5173',
  'https://whiskerwatch.site',
  'https://www.whiskerwatch.site',
  'https://whiskerwatch-cp2-4qdb0i38l-whisker-watch.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error('❌ Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);


app.use(
  "/uploads/cats",
  express.static(path.join(process.cwd(), "FileUploads/cats"))
);


await connectDB()

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
    maxAge: 1000 * 60 * 60 * 24,
  }
}));

app.use('/cat', CatRoute)
app.use('/user', UserRoute)
app.use('/admin', AdminRoute)
app.use('/whisker', WhiskerMeterRoute);
app.use('/donate', DonationRoute);
app.use('/adopt', HVAdoptionRoute);
app.use('/otp', otpRoute);



app.use(express.json({limit: '10mb'}));
app.use(cookieParser());
app.use('/FileUploads', express.static(path.join(__dirname, 'FileUploads')));



app.use(express.json());



const port = process.env.PORT || 5000;



const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const dir = path.join(process.cwd(), "FileUploads/cats")

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    } 
    callback(null, dir);
  },

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
      // req.err = 'File is invalid!'
      // callback(null, false)

      if (!req.invalidFiles) req.invalidFiles = [];
      req.invalidFiles.push(file.originalname);
      callback(null, false);
    };
  },
});


// POST REQUEST: Upload image to a file path 'FileUploads'
app.post('/upload/file', upload.single('document') ,  async (req, res) => {
  console.log(req.file)

  if (req.err) {
    return res.status(422).json({message: req.err}) 
  }

  return res.status(200).json({message: 'File uploaded succesfully!'})
});




// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});


