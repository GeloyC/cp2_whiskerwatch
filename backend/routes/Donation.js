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



DonationRoute.post(
  '/donation_application',
  upload_donationProof.single('proof_image'),
  async (req, res) => {
    const db = getDB();
    
    const donator_id = (req.body.donator_id && req.body.donator_id !== 'null') 
      ? req.body.donator_id 
      : null; 
    
    const { items } = req.body;
    const file = req.file;

    let application_id = null; // Initialize the application ID

    try {
      // Basic input validation
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
      
      const insertedItemIds = [];

      for (let i = 0; i < parsedItems.length; i++) {
        const item = parsedItems[i];
        
        if (!item.donation_type || !validDonationTypes.includes(item.donation_type)) {
          console.error('Invalid donation_type:', item);
          return res.status(400).json({ message: `Invalid donation_type: ${item.donation_type || 'missing'}` });
        }
        
        // Extract item-specific data, defaulting to NULL if not present
        const itemDescription = item.description || null;
        const itemAmount = item.amount || null; 
        const itemFoodType = item.food_type ? item.food_type.join(',') : null; 
        const itemQuantity = item.quantity || null;
        
        // Use the application_id placeholder for all inserts initially
        const temp_application_id = application_id || 0; 

        const [insertResult] = await db.query(
          `INSERT INTO donation_application_items (
            application_id, donator_id, date_applied, status, proof_image, description,
            donation_type, amount, food_type, quantity
          ) VALUES (?, ?, NOW(), 'Pending', ?, ?, ?, ?, ?, ?)
          `,
          [
            temp_application_id, // Temporarily use 0 (or a placeholder value)
            donator_id,          // Correctly NULL for anonymous donations
            proofImageURL, 
            itemDescription,
            item.donation_type,
            itemAmount,
            itemFoodType,
            itemQuantity,
          ]
        );
        
        insertedItemIds.push(insertResult.insertId);

        // 3. 🔑 Capture the application_id from the first inserted item's item_id
        if (i === 0) {
            application_id = insertResult.insertId;
        }
      }

      if (application_id) {
        await db.query(`
          UPDATE donation_application_items 
          SET application_id = ? 
          WHERE item_id IN (?)`, 
          [application_id, insertedItemIds]
        );
      }
      

      if (donator_id) {
        await db.query(
          `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
          [
            donator_id,
            `Your donation has been submitted for review. We’ll notify you once it’s approved or rejected.`,
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

// Get the list of donation application
// DonationRoute.get('/donation_applications_pending', async (req, res) => {
//     const db = getDB();

//     try {
//         const [rows] = await db.query(`
//           SELECT
//             dai.application_id,
//             dai.item_id,
//             dai.donator_id,
//             IFNULL(CONCAT(u.firstname, ' ', u.lastname), 'Anonymous') AS donator_name,
//             dai.status,
//             DATE_FORMAT(dai.date_applied, '%Y-%m-%d') AS date_applied,
//             dai.donation_type,
//             dai.amount,
//             dai.food_type,
//             dai.quantity,
//             dai.proof_image,
//               CASE
//                   WHEN dai.donation_type = 'Money' AND dai.proof_image IS NOT NULL 
//                       THEN CONCAT('Proof: ', dai.proof_image)
//                   ELSE dai.description
//               END AS display_description 
//           FROM
//               donation_application_items dai
//           LEFT JOIN users u ON dai.donator_id = u.user_id
//           WHERE
//               dai.status = 'Pending'
//           ORDER BY
//               dai.application_id, dai.item_id;
//         `);

//         // Group items by the main application_id to present them logically in the frontend
//         const applications = {};
//         rows.forEach(row => {
//             const id = row.application_id;
//             if (!applications[id]) {
//                 // Initialize the main application object with shared data
//                 applications[id] = {
//                     application_id: id,
//                     donator_id: row.donator_id,
//                     donator_name: row.donator_name,
//                     date_applied: row.date_applied,
//                     status: row.status,
//                     // Take the description from the first item, or an aggregate description
//                     description: row.description || 'Multiple items donated.',
//                     items: []
//                 };
//             }
//             // Add the item details
//             applications[id].items.push({
//                 item_id: row.item_id,
//                 donation_type: row.donation_type,
//                 amount: row.amount,
//                 food_type: row.food_type,
//                 quantity: row.quantity,
//                 description: row.description,
//                 proof_image: row.proof_image,
//             });
//         });

//         return res.json(Object.values(applications));

//     } catch (err) {
//         console.error('Error fetching pending applications:', err);
//         return res.status(500).json({ error: 'Failed to fetch donation applications' });
//     }
// });
DonationRoute.get('/donation_applications_pending', async (req, res) => {
    const db = getDB();

    try {
        const [rows] = await db.query(`
            SELECT
              dai.application_id,
              dai.item_id,
              dai.donator_id,
              IFNULL(CONCAT(u.firstname, ' ', u.lastname), 'Anonymous') AS donator_name,
              dai.status,
              DATE_FORMAT(dai.date_applied, '%Y-%m-%d') AS date_applied,
              dai.donation_type,
              dai.amount,
              dai.food_type,
              dai.quantity,
              dai.proof_image,
                CASE
                    WHEN dai.donation_type = 'Money' AND dai.proof_image IS NOT NULL 
                        THEN CONCAT('Proof: ', dai.proof_image)
                    ELSE dai.description
                END AS display_description 
            FROM
                donation_application_items dai
            LEFT JOIN users u ON dai.donator_id = u.user_id
            WHERE
                dai.status = 'Pending'
            ORDER BY
                dai.application_id, dai.item_id;
        `);

        // Group items by the main application_id
        const applications = {};
        rows.forEach(row => {
            const id = row.application_id;
            if (!applications[id]) {
                // Initialize the main application object with shared data
                applications[id] = {
                    application_id: id,
                    donator_id: row.donator_id,
                    donator_name: row.donator_name,
                    date_applied: row.date_applied,
                    status: row.status,
                    // Use the main application description from the first item
                    description: row.display_description || 'Multiple items donated.', 
                    items: []
                };
            }
            // Add the item details
            applications[id].items.push({
                item_id: row.item_id,
                donation_type: row.donation_type,
                amount: row.amount,
                food_type: row.food_type,
                quantity: row.quantity,
                // Use the modified description for the item
                description: row.display_description, 
                proof_image: row.proof_image,
            });
        });

        return res.json(Object.values(applications));

    } catch (err) {
        console.error('Error fetching pending applications:', err);
        return res.status(500).json({ error: 'Failed to fetch donation applications' });
    }
});



// Post the accepted/rejected donated
DonationRoute.post('/donation_review', async (req, res) => {
    const db = getDB();
    // Get the application_id and the decision (e.g., 'Accepted' or 'Rejected')
    const { application_id, decision, admin_remarks = null } = req.body;

    if (!application_id || !decision || !['Accepted', 'Rejected'].includes(decision)) {
        return res.status(400).json({ message: 'Invalid application ID or decision.' });
    }

    // Start a transaction for data consistency
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Fetch all items belonging to this application_id
        const [applicationItems] = await connection.query(
            `SELECT * FROM donation_application_items WHERE application_id = ?`,
            [application_id]
        );

        if (applicationItems.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Donation application not found.' });
        }

        const donator_id = applicationItems[0].donator_id; // Donator ID is the same for all items
        const firstItem = applicationItems[0];
        const proofImageURL = firstItem.proof_image;
        let notificationMessage = '';
        let totalPointsEarned = 0;

        if (decision === 'Accepted') {
            // A. INSERT into 'donation' table (the main header)
            const [donationResult] = await connection.query(
                `INSERT INTO donation (donator_id, proofimage, description) VALUES (?, ?, ?)`,
                [donator_id, proofImageURL, firstItem.description || 'Application accepted']
            );
            const donation_id = donationResult.insertId;

            // B. INSERT all items into 'donation_items' table
            for (const item of applicationItems) {
                totalPointsEarned += 10; // Earn points for each item

                let safeFoodType = null;
                if (item.donation_type === 'Food') {
                  if (item.food_type && item.food_type.includes('Wet')) {
                    safeFoodType = 'Wet';
                  } else if (item.food_type && item.food_type.includes('Dry')) {
                    safeFoodType = 'Dry'
                  } else {
                    safeFoodType = null;
                  }
                }

                await connection.query(
                    `INSERT INTO donation_items
                      (donation_id, donation_type, amount, food_type, quantity, description, proof_image)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                      donation_id, 
                      item.donation_type, 
                      item.amount, 
                      safeFoodType, 
                      item.quantity, 
                      item.description, 
                      item.proof_image
                    ]
                );
            }

            // C. Update Whiskermeter points and badge (reuse your logic)
            if (donator_id && totalPointsEarned > 0) {
                // Update whiskermeter
                await connection.query(`
                  INSERT INTO whiskermeter (user_id, points) VALUES (?, ?)
                    ON DUPLICATE KEY UPDATE points = points + ?, last_updated = CURRENT_TIMESTAMP`,
                  [donator_id, totalPointsEarned, totalPointsEarned]
                );

                // Get new points and update badge
                const [[{ points }]] = await connection.query(
                    `SELECT points FROM whiskermeter WHERE user_id = ?`,
                    [donator_id]
                );
                
                let newBadge = 'Toe Bean Trainee';
                if (points >= 500) newBadge = 'The Catnip Captain';
                else if (points >= 300) newBadge = 'Meowtain Mover';
                else if (points >= 200) newBadge = 'Furmidable Friend';
                else if (points >= 100) newBadge = 'Snuggle Scout';

                await connection.query(
                    `UPDATE users SET badge = ? WHERE user_id = ?`,
                    [newBadge, donator_id]
                );

                const badgeMessage = `Congratulations on achieving a badge of ${newBadge}. Keep on going!`;
                await connection.query(
                    `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
                    [donator_id, badgeMessage]
                );

                notificationMessage = `Your donation application (ID: ${application_id}) has been **Accepted**! You earned ${totalPointsEarned} points. Thank you for your kindness!`;
            } else {
                notificationMessage = `Your anonymous donation application (ID: ${application_id}) has been **Accepted**! Thank you for your kindness!`;
            }

        } else if (decision === 'Rejected') {
            notificationMessage = `Your donation application (ID: ${application_id}) has been **Rejected**. Admin Remarks: ${admin_remarks || 'No reason provided.'}.`;
        }
        
        // D. Update 'donation_application_items' status and admin remarks
        await connection.query(`
          UPDATE donation_application_items 
            SET status = ?, admin_remarks = ?, reviewed_at = CURRENT_TIMESTAMP 
            WHERE application_id = ?`,
          [decision, admin_remarks, application_id]
        );

        // E. Send final notification (if not anonymous)
        if (donator_id) {
          await connection.query(
            `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
            [donator_id, notificationMessage]
          );
        }

        // F. Commit the transaction
        await connection.commit();
        res.status(200).json({ 
            message: `Donation application ${application_id} ${decision.toLowerCase()} successfully.`,
            pointsEarned: totalPointsEarned
        });

    } catch (err) {
        await connection.rollback();
        console.error('Donation review transaction error:', err);
        res.status(500).json({ message: 'Server error during donation review.', error: err.message });
    } finally {
        connection.release();
    }
});



// DonationRoute.get('/donation_list', async (req, res) => {
//   const db = getDB();

//   try {
//     const [rows] = await db.query(`
//       SELECT
//         di.item_id,
//         u.user_id AS donator_id,
//         di.donation_type,

//         CASE
//             WHEN di.donation_type = 'Money' THEN di.amount
//             ELSE di.quantity
//         END AS quantity,

//         di.description AS item_description,
//         d.proofimage AS donation_image,
//         CONCAT(u.firstname, ' ', u.lastname) AS donator_name,
//         DATE_FORMAT(d.date_donated, '%Y-%m-%d') AS date_donated
//       FROM
//         donation_items di
//       JOIN donation d ON di.donation_id = d.donation_id
//       JOIN users u ON d.donator_id = u.user_id
//       ORDER BY d.date_donated DESC;
//     `);

//     console.log(rows)
//     return res.json(rows);
    
//   } catch (err) {
//     console.error('Error fetching cat profile:', err);
//     return res.status(500).json({ error: 'Failed to fetch cat profile' });
//   }
// });


DonationRoute.get('/donation_list', async (req, res) => {
    const db = getDB();

    try {
        const [rows] = await db.query(`
          SELECT
            di.item_id,
            d.donation_id,
            d.donator_id,
            di.donation_type,

            CASE
                WHEN di.donation_type = 'Money' THEN CONCAT('PHP ', di.amount)
                ELSE di.quantity
            END AS quantity_display,

            IFNULL(di.description, d.description) AS item_description,
            
            d.proofimage AS donation_image,
            
            IFNULL(CONCAT(u.firstname, ' ', u.lastname), 'Anonymous') AS donator_name,
            
            DATE_FORMAT(d.date_donated, '%Y-%m-%d') AS date_donated
          FROM
              donation_items di
          JOIN donation d ON di.donation_id = d.donation_id
          LEFT JOIN users u ON d.donator_id = u.user_id
          ORDER BY d.date_donated DESC;
        `);

        return res.json(rows);
        
    } catch (err) {
        console.error('Error fetching donation list:', err);
        return res.status(500).json({ error: 'Failed to fetch accepted donation data' });
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