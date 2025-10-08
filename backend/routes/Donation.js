import express from "express";
import { Router } from "express";

import { getDB } from "../database.js"

import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const DonationRoute = Router();
DonationRoute.use(express.json());


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






const donationImageStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        const dir = path.join(process.cwd(), "FileUploads/donation_image")
        
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



const upload_donationProof = multer({
  storage: donationImageStorage, 
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




// // ---------------- DONATIONS ---------------- //



DonationRoute.post('/donation_data', upload_donationProof.single('proof_image'), async (req, res) => {
  const db = getDB()
  const { donator_id, items } = req.body;
  const file = req.file;

  try {
    if (!donator_id || !items) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const parsedItems = JSON.parse(items); // frontend sends JSON as a string
    const proofImageFilename = file?.filename || null;

    const [donationResult] = await db.query(
      `INSERT INTO donation (donator_id, proofimage, description) VALUES (?, ?, ?)`,
      [donator_id, proofImageFilename, '']
    );

    const donation_id = donationResult.insertId;
    console.log('Uploaded file:', file);

    let totalPointsEarned = 0;

    // 2. Insert into donation_items
    for (const item of parsedItems) {
      const {
        donation_type,
        amount = null,
        food_type = null,
        quantity = null,
        description = null,
      } = item;

      await db.query(
        `INSERT INTO donation_items (donation_id, donation_type, amount, food_type, quantity, description)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [donation_id, donation_type, amount, food_type, quantity, description]
      );

      totalPointsEarned += 10; // fixed 10 points per donation transaction


      let itemSummary = '';
      switch (donation_type) {
        case 'Money':
          itemSummary = `${amount} PHP`;
          break;
        case 'Food':
          itemSummary = `${quantity}x ${food_type} food`;
          break;
        case 'Item':
        case 'Other':
          itemSummary = `${quantity}x ${donation_type.toLowerCase()} item(s)`;
          break;
        default:
          itemSummary = 'an item';
      }

      let message = `We received your donation of ${itemSummary} . We'd like to thank you for donating to WhiskerWatch! `;
        
      await db.query(
          `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
          [donator_id, message]
      );
    }

    // Update whiskermeter points
    if (totalPointsEarned > 0) {
      // Check if user already has a whiskermeter entry
      const [rows] = await db.query(
        `SELECT points FROM whiskermeter WHERE user_id = ?`,
        [donator_id]
      );

      if (rows.length > 0) {
        // Update existing points by adding earned points
        await db.query(
          `UPDATE whiskermeter SET points = points + ?, last_updated = CURRENT_TIMESTAMP WHERE user_id = ?`,
          [totalPointsEarned, donator_id]
        );
      } else {
        // Insert new whiskermeter row
        await db.query(
          `INSERT INTO whiskermeter (user_id, points) VALUES (?, ?)`,
          [donator_id, totalPointsEarned]
        );
      }

      const [[{ points }]] = await db.query(
        `SELECT points FROM whiskermeter WHERE user_id = ?`,
        [donator_id]
      );

      let newBadge = 'Toe Bean Trainee';
      if (points >= 500) newBadge = 'The Catnip Captain';
      else if (points >= 300) newBadge = 'Meowtain Mover';
      else if (points >= 200) newBadge = 'Furmidable Friend';
      else if (points >= 100) newBadge = 'Snuggle Scout';

      await db.query(
        `UPDATE users SET badge = ? WHERE user_id = ?`,
        [newBadge, donator_id]
      );

      let message = `Congratulations on achieving a badge of ${newBadge}. Keep on going!`;

      await db.query(
          `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
          [donator_id, message]
      );
    }

    res.status(201).json({ message: 'Donation submitted successfully!', pointsEarned: totalPointsEarned });
  } catch (err) {
    console.error('Donation error:', err);
    res.status(500).json({ message: 'Server error during donation submission.' });
  }
});


DonationRoute.get('/donation_list', async (req, res) => {
  const db = getDB();

  try {
    const [rows] = await db.query(`
      SELECT
        di.item_id,
        u.user_id AS donator_id,
        di.donation_type,

        CASE
            WHEN di.donation_type = 'Money' THEN di.amount
            ELSE di.quantity
        END AS quantity,

        di.description AS item_description,
        d.proofimage AS donation_image,
        CONCAT(u.firstname, ' ', u.lastname) AS donator_name,
        DATE_FORMAT(d.date_donated, '%Y-%m-%d') AS date_donated
      FROM
        donation_items di
      JOIN donation d ON di.donation_id = d.donation_id
      JOIN users u ON d.donator_id = u.user_id
      ORDER BY d.date_donated DESC;
    `);

    console.log(rows)
    return res.json(rows);
    
  } catch (err) {
    console.error('Error fetching cat profile:', err);
    return res.status(500).json({ error: 'Failed to fetch cat profile' });
  }
});


DonationRoute.get('/money_donations_summary', async (req, res) => {
  const db = getDB();

  try {
    const [[{ total_money_donated }]] = await db.query(`
      SELECT SUM(amount) AS total_money_donated
      FROM donation_items
      WHERE donation_type = 'Money';
    `);

    const [[{ total_money_donated_this_month }]] = await db.query(`
      SELECT SUM(amount) AS total_money_donated_this_month
      FROM donation_items
      WHERE donation_type = 'Money'
        AND MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE());
    `);

    return res.json({
      total_money_donated: total_money_donated || 0,
      total_money_donated_this_month: total_money_donated_this_month || 0
    });
  } catch (err) {
    console.error('Error fetching donation summary:', err);
    return res.status(500).json({ error: 'Failed to fetch donation summary.' });
  }
});



export default DonationRoute;