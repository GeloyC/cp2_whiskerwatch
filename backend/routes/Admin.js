import express from "express";
import cors from "cors";
import { Router } from "express";
import {getDB} from "../database.js"
import bcrypt from 'bcrypt';

import multer from 'multer';
import fs, { stat } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { verifyUser } from "./User.js";
import { Link } from "@react-email/components";

const AdminRoute = Router();
AdminRoute.use(express.json());

AdminRoute.use(
    cors({ origin: "http://localhost:5173",
        credentials: true, 
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }), 
);

AdminRoute.use(
cors({
    origin: [/http:\/\/localhost:\d+$/], // allow any localhost:port
    // credentials: true,
})
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



AdminRoute.use('/FileUploads', express.static(path.join(__dirname, 'FileUploads')));


const storage = multer.diskStorage({
    destination: function(req, file, callback) {
    const dir = 'FileUploads';
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }

    callback(null, dir);
    },
    filename: function(req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname))
    } 
})

const fileFilter = function(req, file, callback) {
    if (file.mimetype == 'application/pdf') {
        callback(null, true)
    } else {
        req.err = 'File is invalid!'
        callback(null, false)
    }
}

const uploadImages = multer({
    storage,
    fileFilter: function(req, file, callback) {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        callback(null, true)
        } else {
        !req.invalidFiles ? req.invalidFiles = [file.originalname] : req.invalidFiles.push(file.originalname)
        callback(null, false)
        }
    }
});

const certificateStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        const dir = path.join(process.cwd(), "FileUploads/certificate")
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        } 
        callback(null, dir);
    },
    
    
    filename: function (req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname));
    },
});

const uploadCertificate = multer({
    storage: certificateStorage, 
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


const upload = multer({ storage, fileFilter });




AdminRoute.get('/manage/users', async (req, res) => {
    const db = getDB();
    try {
        const [users] = await db.query("SELECT * FROM users WHERE role IN ('regular','head_volunteer', 'admin')");
        return res.json(users);

    } catch(err) {
        console.error('Error fetching user profiles:', err);
        return res.status(500).json({ err: 'Failed to fetch user list.' });
    }
});

AdminRoute.get('/manage/adminlist', async (req, res) => {
    const db = getDB();
    try {
        const [admin] = await db.query(
        "SELECT user_id, firstname, lastname, email, DATE_FORMAT(last_login, '%Y-%m-%d') AS last_login FROM users WHERE role = 'admin'")

        return res.json(admin)

    } catch(err) {
        console.error('Error fetching admin profiles: ', err);
        return res.status(500).json({err: 'Failed to fetch admin list.'})
    }
})

AdminRoute.get('/manage/non_admin', async (req, res) => {
    const db = getDB();
    try {
        const [admin] = await db.query(
        "SELECT user_id, firstname, lastname, email FROM users WHERE role NOT IN ('admin')")
        return res.json(admin)
    } catch(err) {
        console.error('Error fetching user profiles: ', err);
        return res.status(500).json({err: 'Failed to fetch admin list.'})
    }
})


AdminRoute.patch('/manage/userupdate/:user_id' , async (req, res) => {
    const db = getDB();
    const user_id = req.params.user_id;
    const {
        firstname = '',
        lastname = '',
        role = '',
        email = '',
        contactnumber = '',
        birthday = '',
        address = '',
    } = req.body

    try {
        const [result] = await db.query(
        `UPDATE users SET
            firstname = ?,
            lastname = ?,
            role = ?,
            email = ?,
            contactnumber = ?,
            birthday = ?,
            address = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?`,
        [firstname, lastname, role, email, contactnumber, birthday, address, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'User not found!'});
        }

        res.status(200).json({ message: 'User updated successfully' });

    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ error: 'Internal server error' });

    }
})


// GET REQUEST: FETCHES THE USER DATA FOR ROLE UPDATE
AdminRoute.get('/manage/role/:user_id', async (req, res) => {
    const db = getDB();
    const user_id = req.params.user_id;

    try {
        const [role] = await db.query(`SELECT firstname, lastname, email, role FROM users WHERE user_id = ?`, [user_id]);
        
        return res.json(role[0])
    } catch (err) {
        console.error('Error fetching user: ', err)
        res.status(500).json({error: 'Internal Server failed!'})
    }
});

// PATCH REQUEST: UPDATE THE ROLE OF A USER INTO ADMIN/HEAD VOLUNTEER/REGULAR
AdminRoute.patch('/manage/update/:user_id', async (req, res) => {
    const db = getDB();
    const user_id = req.params.user_id;
    const {
        firstname = '',
        lastname = '',
        email = '',
        role = ''
    } = req.body

    try {
        const [update] = await db.query(`
            UPDATE users SET
                firstname = ?, 
                lastname = ?,
                email = ?,
                role = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?`,
            [firstname, lastname, email, role, user_id]);

            if (update.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User role updated successfully!' });

        console.log(update)
    } catch (err) {
        console.error('Error updating user role: ', err);
        return res.status(500).json({err: 'Failed to update role.'})
    }
});

AdminRoute.patch('/manage/update_admin', async (req, res) => {
    const db = getDB();
    const {user_id} = req.body
    try {
        const query = await db.query(` 
            UPDATE users SET role = 'admin' WHERE user_id = ?
        `, [user_id])

        let message = `Your role at WhiskerWatch is now updated to admin. Congratulations`;
        
        await db.query(
            `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
            [user_id, message]
        );

        return res.json({ success: true, result: query });

    } catch (err) {
        return res.status(500).json({err: 'Failed to update user role to admin!'})
    }
});


AdminRoute.get('/manage/userprofile/:user_id', async (req, res) => {
    const db = getDB();
    const user_id = req.params.user_id 

    try {
        const [userprofile] = await db.query(
            `SELECT 
                user_id, firstname, lastname, profile_image, contactnumber, DATE_FORMAT(birthday, '%Y-%m-%d') AS birthday, email, username, role, badge, address, 
                DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at, DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at 
            FROM users
            WHERE user_id = ?;`, [user_id]
        );
        return res.json(userprofile[0])
    } catch(err) {
        console.error('Error fetching user data: ', err);
        return res.status(500).json({err: 'Failed to fetch user data.'});
    }
});


AdminRoute.get('/feeders/application', async (req, res) => {
    const db = getDB();

    try {
        const [applications] = await db.query(`
            SELECT
                va.application_id AS application_number,
                u.firstname,
                u.lastname,
                va.application_form,
                DATE_FORMAT(va.application_date, '%Y-%m-%d') AS date_applied,
                va.status
            FROM
                volunteer_application va
            JOIN
                users u ON va.user_id = u.user_id  
            WHERE va.status = 'Pending'
        `);

        return res.json(applications)
    } catch (err) {
        console.error('Error fetching application data: ', err)
        res.status(500).json({error: 'Internal Server failed!'})
    }
});

AdminRoute.get('/form/:application_id', async (req, res) => {
    const db = getDB();
    const application_id = req.params.application_id;

    try {
        const [application] = await db.query(`
            SELECT
                va.application_id AS application_id,
                u.firstname,
                u.lastname,
                va.application_form,
                DATE_FORMAT(va.application_date, '%Y-%m-%d') AS date_applied,
                va.status
            FROM
                volunteer_application va
            JOIN
                users u ON va.user_id = u.user_id
            WHERE va.application_id = ?; 
        `, [application_id]);

        return res.json(application[0]);
    } catch (err) {
        console.error('Error fetching application data: ', err)
        res.status(500).json({error: 'Internal Server failed!'})
    }
})


AdminRoute.patch('/form/status_update/:application_id', verifyUser, async (req, res) => {
    const db = getDB();
    const application_id = req.params.application_id;
    const { status } = req.body;
    let totalPointsEarned = 0;

    console.log('Incoming PATCH request');
    console.log('Application ID:', application_id);
    console.log('Status:', status);

    try {
        const [statusupdate] = await db.query(`
            UPDATE volunteer_application SET
                status = ? 
            WHERE application_id = ?
        `, [status, application_id]);

        if (status === 'Accepted') {
            // 2.1 Get user info linked to this application
            const [userData] = await db.query(`
                SELECT va.user_id, u.firstname, u.lastname, va.application_date
                FROM volunteer_application va
                JOIN users u ON va.user_id = u.user_id
                WHERE va.application_id = ?
            `, [application_id]);

            if (userData.length === 0) {
                return res.status(404).json({ error: 'User not found for this application' });
            }

            const { user_id, firstname, lastname, application_date } = userData[0];

            if (req.user.user_id === user_id) {
                return res.status(403).json({ error: "You can't approve or reject your own application." });
            }

            const fullName = `${firstname} ${lastname}`;
            totalPointsEarned += 10;

            // 2.2 Insert into volunteer table
            await db.query(`
                INSERT INTO volunteer (feeder_id, name, feeding_date, application_date, status)
                VALUES (?, ?, NOW(), ?, 'Approved')
            `, [user_id, fullName, application_date]);

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

                let message = `Congratulations on achieving a badge of ${newBadge}. Keep on going!`;

                await db.query(
                    `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
                    [user_id, message]
                );
                }

            console.log('Volunteer record created for user_id:', user_id);
            console.log('User Info:', { user_id, firstname, lastname, application_date });

            let message = `Your volunteer application is ${status}. Congratulations`;
            
            await db.query(
                `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
                [user_id, message]
            );

        } else if (status === 'Rejected') {
            let message = `Your volunteer application is ${status}. You can always apply again!`;

            await db.query(
                `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
                [user_id, message]
            );
        }

        console.log('Status received:', status);
        return res.json({ success: true, result: statusupdate});
    } catch (err) {
        return res.status(500).json({err: 'Failed to update status!'})
    }
});





AdminRoute.get('/feeders', async (req, res) => {
    const db = getDB();
    try {
        const [volunteers] = await db.query(`
            SELECT v.feeder_id, u.firstname, u.lastname, u.contactnumber, 
                DATE_FORMAT(v.feeding_date, '%Y-%m-%d %H:%i:%s') AS feeding_date, 
                v.status
            FROM volunteer v
            JOIN users u ON v.feeder_id = u.user_id
            WHERE v.status = 'Approved';
        `);

        return res.json(volunteers);
    } catch (err) {
        return res.status(500).json({err: 'Failed to retrieve volunteers!'})
    }
})


AdminRoute.patch('/feeders/feeding_date', async (req, res) => {
    const db = getDB();
    const { feeder_id, feeding_date } = req.body;

    if (!feeder_id || !feeding_date) {
        return res.status(400).json({ error: 'feeder_id and feeding_date are required' });
    }

    try {

        // TODO: REMOVE EXPIRATION DATES
        const [result] = await db.query(`
        UPDATE volunteer
        SET feeding_date = ?
        WHERE feeder_id = ?
        `, [feeding_date, feeder_id]);

        if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Volunteer not found' });
        }

        const formattedDate = new Date(feeding_date).toLocaleString('en-US', {
            dateStyle: 'long',
        });


        let message = `Your feeding date as volunteer is ${formattedDate}.`;

        await db.query(
            `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
            [feeder_id, message]
        );

        return res.json({ success: true, message: 'Feeding date updated successfully' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update feeding date' });
    }
});


// Get the feeding_date per user
AdminRoute.get('/feeding_date/:feeder_id', async (req, res) => {
    const db = getDB();
    const feeder_id  = req.params.feeder_id;

    try {   
        // const [row] = await db.query(`
        //     SELECT 
        //         DATE_FORMAT(feeding_date, '%Y-%m-%d') AS feeding_date
        //     FROM volunteer WHERE feeder_id = ?
        // `, [feeder_id]);

        const [rows] = await db.query(`
            SELECT 
                DATE_FORMAT(feeding_date, '%Y-%m-%d') AS feeding_date,
                status
            FROM volunteer 
            WHERE feeder_id = ?
            ORDER BY feeding_date DESC
            LIMIT 1
        `, [feeder_id]);

        if (rows.length === 0 || !rows[0].feeding_date) {
            return res.status(404).json({ error: 'Feeding date not found for this feeder.' });
        }

        const feedingDate = rows[0].feeding_date;

        // Check if a report already exists for that date
        // const [reportRow] = await db.query(
        //     `SELECT * FROM feeding_report WHERE feeder_id = ? AND feeding_date = ?`,
        //     [feeder_id, feedingDate]
        // );

        const [reportRows] = await db.query(`
            SELECT report_id 
            FROM feeding_report 
            WHERE user_id = ? 
            AND DATE(created_at) = ?
        `, [feeder_id, feedingDate]);

        const hasReport = reportRows.length > 0;

        return res.json({
            feeding_date: feedingDate,
            has_report: hasReport,
        });


    } catch (err) { 
        console.error('Failed to fetch feeder data: ', err);
        res.status(500).json({error: 'Internal Server failed!'})
    }
    
});



AdminRoute.get('/adoption/application', async (req, res) => {
    const db = getDB();

    try {
        const [applications] = await db.query(`
            SELECT 
                aa.application_id,
                u.firstname,
                u.lastname,
                c.name AS cat_name,
                DATE_FORMAT(aa.application_date, '%Y-%m-%d') AS application_date,
                aa.application_form,
                aa.status
            FROM adoption_application aa
            JOIN users u ON aa.user_id = u.user_id
            JOIN cat c ON aa.cat_id = c.cat_id
            WHERE aa.status = 'Pending'
            ORDER BY aa.application_date DESC;

        `);

        return res.json(applications)
    } catch (err) {
        console.error('Error fetching application data: ', err)
        res.status(500).json({error: 'Internal Server failed!'})
    }
});


AdminRoute.get('/adoption_form/:application_id', async (req, res) => {
    const db = getDB();
    const { application_id } = req.params;

    try {
        const [application] = await db.query(`
            SELECT 
                aa.application_id,
                u.firstname,
                u.lastname,
                aa.application_form,
                DATE_FORMAT(aa.application_date, '%Y-%m-%d') AS application_date,
                aa.status
            FROM adoption_application aa
            JOIN users u ON aa.user_id = u.user_id
            WHERE aa.application_id = ?;
        `, [application_id]);

        if (application.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        return res.json(application[0]);
    } catch (err) {
        console.error('Error fetching application data: ', err)
        res.status(500).json({error: 'Internal Server failed!'})
    }
})


AdminRoute.patch('/adoption_form/status_update/:application_id', verifyUser, async (req, res) => {
    const db = getDB();
    const { application_id } = req.params;
    const { status } = req.body; 
    let totalPointsEarned = 0;
    try {
        // 1. Get application details
        const [apps] = await db.query(
            `SELECT aa.*, u.firstname, u.lastname, u.contactnumber, c.name AS cat_name
                FROM adoption_application aa
                JOIN users u ON aa.user_id = u.user_id
                JOIN cat c ON aa.cat_id = c.cat_id
                WHERE aa.application_id = ?`,
            [application_id]
        );

        if (apps.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        const application = apps[0];

        if (req.user.user_id === application.user_id) {
            return res.status(403).json({ message: "You can't approve or reject your own adoption application." });
        }

        // 2. Update application status
        await db.query(
            `UPDATE adoption_application SET status = ? WHERE application_id = ?`,
            [status, application_id]
        );

        

        if (status === 'Accepted') {
            // 3. Insert into adoption table WITHOUT certificate
            await db.query(
                `INSERT INTO adoption (
                    adoptedcat_id,
                    adopter_id,
                    cat_name,
                    adopter,
                    contactnumber
                    ) VALUES (?, ?, ?, ?, ?)`,
                [
                    application.cat_id,
                    application.user_id,
                    application.cat_name,
                    `${application.firstname} ${application.lastname}`,
                    application.contactnumber
                ]
            );

            console.log("Updating cat status for cat_id:", application.cat_id);
            // Optionally update cat adoption_status here
            await db.query(
                `UPDATE cat SET adoption_status = 'Adopted' WHERE cat_id = ?`,
                [application.cat_id]
            );

            totalPointsEarned += 10;

            let message = `Your adoption application is now ${status}. Congratulations! Please wait for your adoption certificate which you can view on your Profile page`;

            await db.query(
                `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
                [application.user_id, message]
            );

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
                    [newBadge, application.user_id]
                );

                let message = `Congratulations on achieving a badge of ${newBadge}. Keep on going!`;

                await db.query(
                    `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
                    [application.user_id, message]
                );
            }
        } else if (status === 'Rejected') {
            let message = `Your adoption application is now ${status}. You can always apply again!`;

            await db.query(
                `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
                [application.user_id, message]
            );
        }

        res.json({ message: `Application ${status.toLowerCase()} successfully` });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

AdminRoute.get('/adopters', async (req, res) => {
    const db = getDB();
    try {
        const [adopters] = await db.query(`
            SELECT adoption_id, cat_name, adopter, 
                DATE_FORMAT(adoption_date, '%Y-%m-%d') AS adoption_date,
                certificate, contactnumber
            FROM adoption;
        `);

        return res.json(adopters);
    } catch (err) {
        return res.status(500).json({err: 'Failed to retrieve adopters!'})
    }
})

AdminRoute.get('/adopters/month', async (req, res) => {
    const db = getDB();
    try {
        const [adoptions] = await db.query(`
            SELECT *
            FROM adoption
            WHERE MONTH(adoption_date) = MONTH(CURRENT_DATE())
            AND YEAR(adoption_date) = YEAR(CURRENT_DATE());
        `);

        return res.json(adoptions);
    } catch (err) {
        console.error('Error fetching monthly adopters:', err);
        return res.status(500).json({ error: 'Failed to fetch monthly adopters.' });
    }
})


AdminRoute.get('/adopters_certificate/:user_id', async (req, res) => {
    const db = getDB();
    const user_id = req.params.user_id;

    try {
        const [rows] = await db.query(
            'SELECT certificate FROM adoption WHERE adopter_id = ?',
            [user_id]
        );
        res.json(rows); // returns an array of certificates
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});



AdminRoute.post('/upload_certificate', uploadCertificate.single('certificate'), async (req, res) => {
    const db = getDB();
    const { adoption_id } = req.body;
    const filename = req.file.filename;

    try {
        await db.query(
            'UPDATE adoption SET certificate = ? WHERE adoption_id = ?',
            [filename, adoption_id]
        );

        const [userResult] = await db.query(
            `SELECT adopter_id FROM adoption WHERE adoption_id = ?`,
            [adoption_id]
        );

        if (!userResult || userResult.length === 0) {
            return res.status(404).json({ error: 'Adoption record not found' });
        }

        const user_id = userResult[0].user_id;

        const message = 'Your adoption certificate is now available. Visit your profile to view it. Congratulations!';
        await db.query(
            `INSERT INTO notifications (user_id, message, is_read, created_at)
            VALUES (?, ?, 0, NOW())`,
            [user_id, message]
        );

        res.json({ message: 'Certificate uploaded and notification sent' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload certificate and notify user' });
    }
});


export default AdminRoute;