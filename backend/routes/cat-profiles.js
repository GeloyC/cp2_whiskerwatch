import express from 'express';
import db from '../database.js';



const router = express.Router();


router.get('/list', async (req, res) => {
    try {
        const db = await dbPromise;
        const [rows] = await db.query('SELECT * FROM cat')
        return res.json(rows)
    } catch(err) {
        console.error('Error fetching cat profiles:', err);
        return res.status(500).json({ err: 'Failed to fetch cat profiles' });    
    }
})


export default router;