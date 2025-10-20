import express from "express";
import { Router } from "express";

import { getDB } from "../database.js"
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const DonationRoute = Router();
DonationRoute.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


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


const donationImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'whiskerwatch/donation_proofs', // folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    public_id: (req, file) => `proof_${Date.now()}_${file.originalname}`,
  },
});


const upload_donationProof = multer({
  storage: donationImageStorage,
  fileFilter: function (req, file, callback) {
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
DonationRoute.post(
  '/donation_data',
  upload_donationProof.single('proof_image'),
  async (req, res) => {
    const db = getDB();
    const { donator_id, items } = req.body;
    const file = req.file;

    try {
      if (!donator_id || !items) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const parsedItems = JSON.parse(items); // frontend sends JSON as a string
      const proofImageURL = file?.path || null; // Cloudinary URL


      const [donationResult] = await db.query(
        `INSERT INTO donation (donator_id, proofimage, description) VALUES (?, ?, ?)`,
        [donator_id, proofImageURL, '']
      );

      const donation_id = donationResult.insertId;
      let totalPointsEarned = 0;


      for (const item of parsedItems) {
        const {
          donation_type,
          amount = null,
          food_type = null,
          quantity = null,
          description = null,
        } = item;


        const itemProofImage = donation_type === 'Money' ? proofImageURL : null;

        await db.query(
          `INSERT INTO donation_items
            (donation_id, donation_type, amount, food_type, quantity, description, proof_image)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [donation_id, donation_type, amount, food_type, quantity, description, itemProofImage]
        );

        totalPointsEarned += 10; // fixed 10 points per donation transaction

        // Notification message
        let itemSummary = '';
        switch (donation_type) {
          case 'Money':
            itemSummary = `PHP${amount}`;
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

        const message = `We received your donation of ${itemSummary}. We'd like to thank you for donating to WhiskerWatch!`;
        await db.query(
          `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
          [donator_id, message]
        );
      }

      // Update whiskermeter points and badge (same as your current logic)
      if (totalPointsEarned > 0) {
        const [rows] = await db.query(
          `SELECT points FROM whiskermeter WHERE user_id = ?`,
          [donator_id]
        );

        if (rows.length > 0) {
          await db.query(
            `UPDATE whiskermeter SET points = points + ?, last_updated = CURRENT_TIMESTAMP WHERE user_id = ?`,
            [totalPointsEarned, donator_id]
          );
        } else {
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

        const badgeMessage = `Congratulations on achieving a badge of ${newBadge}. Keep on going!`;
        await db.query(
          `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
          [donator_id, badgeMessage]
        );
      }

      res.status(201).json({
        message: 'Donation submitted successfully!',
        pointsEarned: totalPointsEarned,
      });
    } catch (err) {
      console.error('Donation error:', err);
      res.status(500).json({ message: 'Server error during donation submission.' });
    }
  }
);


// DonationRoute.post(
//   '/donation_application',
//   upload_donationProof.single('proof_image'),
//   async (req, res) => {
//     const db = getDB();
//     const { donator_id, description, items } = req.body;
//     const file = req.file;

//     try {
//       if (!items) {
//         console.error('Missing items field');
//         return res.status(400).json({ message: 'Missing required fields: items' });
//       }
//       if (!description) {
//         console.error('Missing description field');
//         return res.status(400).json({ message: 'Missing required field: description' });
//       }

//       let parsedItems;
//       try {
//         parsedItems = JSON.parse(items);
//       } catch (parseError) {
//         console.error('Error parsing items:', parseError);
//         return res.status(400).json({ message: 'Invalid items format' });
//       }

//       const validDonationTypes = ['Money', 'Food', 'Item', 'Other'];
//       for (const item of parsedItems) {
//         if (!item.donation_type || !validDonationTypes.includes(item.donation_type)) {
//           console.error('Invalid donation_type:', item);
//           return res.status(400).json({ message: `Invalid donation_type: ${item.donation_type || 'missing'}` });
//         }
//       }

//       console.log('Request details:', { donator_id, description, parsedItems, file });

//       const proofImageURL = file?.path || null;

//       const [applicationResult] = await db.query(
//         `INSERT INTO donation_application_items (
//           donator_id, date_applied, status, proof_image, description,
//           donation_type, amount, food_type, quantity
//         ) VALUES (?, NOW(), 'Pending', ?, ?, ?, ?, ?, ?)
//         `,
//         [
//           donator_id || null,
//           proofImageURL,
//           description,
//           parsedItems[0].donation_type,
//           parsedItems[0].amount || null,
//           parsedItems[0].food_type ? parsedItems[0].food_type.join(',') : null,
//           parsedItems[0].quantity || null,
//         ]
//       );

//       const application_id = applicationResult.insertId;

//       for (let i = 1; i < parsedItems.length; i++) {
//         const item = parsedItems[i];
//         await db.query(
//           `INSERT INTO donation_application_items (
//             application_id, donator_id, date_applied, status, proof_image, description,
//             donation_type, amount, food_type, quantity
//           ) VALUES (?, ?, NOW(), 'Pending', ?, ?, ?, ?, ?, ?)
//           `,
//           [
//             application_id,
//             donator_id || null,
//             proofImageURL,
//             item.description || null,
//             item.donation_type,
//             item.amount || null,
//             item.food_type ? item.food_type.join(',') : null,
//             item.quantity || null,
//           ]
//         );
//       }

//       if (donator_id) {
//         await db.query(
//           `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
//           [
//             donator_id,
//             `Your donation has been submitted for review. We’ll notify you once it’s approved or rejected.`,
//           ]
//         );
//       }

//       res.status(201).json({
//         message: 'Donation submitted successfully and pending review.',
//         application_id,
//       });
//     } catch (err) {
//       console.error('Detailed error:', err.message, err.stack);
//       res.status(500).json({ message: 'Server error during donation submission.', error: err.message });
//     }
//   }
// );

DonationRoute.post(
  '/donation_application',
  upload_donationProof.single('proof_image'),
  async (req, res) => {
    const db = getDB();
    
    // Convert 'null' string to actual null, otherwise use the provided ID string
    const donator_id = (req.body.donator_id && req.body.donator_id !== 'null') 
                       ? req.body.donator_id 
                       : null; 
    
    const { items } = req.body;
    const file = req.file;

    try {
      if (!items) {
        return res.status(400).json({ message: 'Missing required fields: items' });
      }

      let parsedItems;
      try {
        parsedItems = JSON.parse(items);
      } catch (parseError) {
        console.error('Error parsing items:', parseError);
        return res.status(400).json({ message: 'Invalid items format' });
      }
      
      if (parsedItems.length === 0) {
          return res.status(400).json({ message: 'No donation items provided.' });
      }

      const validDonationTypes = ['Money', 'Food', 'Item', 'Other'];
      const proofImageURL = file?.path || null;
      let application_id; // This will hold the ID for the entire transaction

      // 1. 🎯 INSERT A PLACEHOLDER ROW TO GENERATE THE application_id
      // We use the first item's data for the initial placeholder row, 
      // but ensure application_id is set to the generated ID afterwards.
      // NOTE: This initial INSERT will be corrected in the loop below.
      const firstItem = parsedItems[0];
      const initialDescription = firstItem.description || null;
      
      const [placeholderResult] = await db.query(
        `INSERT INTO donation_application_items (
          donator_id, date_applied, status, proof_image, description,
          donation_type, amount, food_type, quantity
        ) VALUES (?, NOW(), 'Pending', ?, ?, 'Placeholder', NULL, NULL, NULL)
        `,
        [donator_id, proofImageURL, initialDescription]
      );
      
      application_id = placeholderResult.insertId;

      // 2. ✏️ DELETE the placeholder row to prepare for the actual item inserts
      // This is a common pattern when using a single table for header and details.
      await db.query(`DELETE FROM donation_application_items WHERE id = ?`, [application_id]);


      // 3. 🔄 LOOP through all items and insert them using the generated application_id
      for (const item of parsedItems) {
        if (!item.donation_type || !validDonationTypes.includes(item.donation_type)) {
          console.error('Invalid donation_type:', item);
          // If validation fails, we might want to clean up the placeholder (if not deleted already)
          return res.status(400).json({ message: `Invalid donation_type: ${item.donation_type || 'missing'}` });
        }
        
        // Extract fields for the current item
        const itemDescription = item.description || null;
        const itemAmount = item.amount || null; 
        const itemFoodType = item.food_type ? item.food_type.join(',') : null; 
        const itemQuantity = item.quantity || null;

        await db.query(
          `INSERT INTO donation_application_items (
            application_id, donator_id, date_applied, status, proof_image, description,
            donation_type, amount, food_type, quantity
          ) VALUES (?, ?, NOW(), 'Pending', ?, ?, ?, ?, ?, ?)
          `,
          [
            // ⭐️ Use the generated application_id here
            application_id, 
            donator_id,
            proofImageURL, 
            itemDescription,
            item.donation_type,
            itemAmount,
            itemFoodType,
            itemQuantity,
          ]
        );
      }
      
      // 4. ✅ Only send notification if a donator_id is present (not anonymous)
      if (donator_id) {
        await db.query(
          `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
          [
            donator_id,
            `Your donation has been submitted for review. We’ve notify you once it’s approved or rejected.`,
          ]
        );
      }

      res.status(201).json({
        message: 'Donation submitted successfully and pending review.',
        application_id: application_id, 
      });
    } catch (err) {
      console.error('Detailed error:', err.message, err.stack);
      res.status(500).json({ message: 'Server error during donation submission.', error: err.message });
    }
  }
);

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