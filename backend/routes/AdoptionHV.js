import express from "express";
import { Router } from "express";
import {getDB} from "../database.js"
import cookieParser from 'cookie-parser';
import session from "express-session";

import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { error } from "console";

const HVAdoptionRoute = Router();
HVAdoptionRoute.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      req.err = 'File is invalid!'
      // callback(null, false)

      if (!req.invalidFiles) req.invalidFiles = [];
      req.invalidFiles.push(file.originalname);
      callback(null, false);
    };
  },
});

HVAdoptionRoute.get("/api/adoption", async (req, res) => {
    const db = getDB();
    try {
        const [rows] = await db.query(
        `SELECT * FROM Adoption ORDER BY date_created DESC`
        );
        // Map DB columns to frontend-friendly names
        const formatted = rows.map((r) => ({
            applicationNo: r.adoption_id,
            user_id: r.adopter_id,
            name: r.adopter,
            type: r.cat_name,
            date: r.date_created.toISOString().split("T")[0], // format as yyyy-mm-dd
            status: r.status || "Pending",
        }));
        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch adoptions" });
    }
});


HVAdoptionRoute.get("/api/adoption/:id/pdf", async (req, res) => {
    const db = getDB();
    try {
        const [rows] = await db.query(
        "SELECT certificate FROM Adoption WHERE adoption_id = ?",
        [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: "Not found" });
        const pdfBuffer = rows[0].certificate;
        res.setHeader("Content-Type", "application/pdf");
        res.send(pdfBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch PDF" });
    }
});


export default HVAdoptionRoute;