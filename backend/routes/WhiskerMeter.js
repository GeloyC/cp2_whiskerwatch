import express from "express";
import { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from 'cookie-parser';

import { getDB } from "../database.js"


const WhiskerMeterRoute = Router();
WhiskerMeterRoute.use(express.json());


WhiskerMeterRoute.get("/whiskermeter/:user_id", async (req, res) => {
    const db = getDB();
    const  user_id  = req.params.user_id;

    try {
        const [rows] = await db.query(
            "SELECT points FROM whiskermeter WHERE user_id = ?",
        [user_id]
        );

        if (rows.length === 0) {
        // No entry for this user yet — you can return 0 points or create a new row here
        return res.json({ points: 0 });
        }

        return res.json({ points: rows[0].points });

    } catch (err) {
        console.error("Error fetching whiskermeter:", err.message);
        res.status(500).json({ error: "Failed to fetch whiskermeter" });
    }
});



// WhiskerMeterRoute.post("/whiskermeter/update", async (req, res) => {
//   const db = getDB();
//   const { user_id, pointsToAdd } = req.body;

//   try {
//     // Update points
//     const [updateMeterResult] = await db.query(
//       "UPDATE whiskermeter SET points = points + ? WHERE user_id = ?",
//       [pointsToAdd, user_id]
//     );
//     console.log("Whisker meter update result:", updateMeterResult);

//     // Get new total
//     const [rows] = await db.query(
//       "SELECT points FROM whiskermeter WHERE user_id = ?",
//       [user_id]
//     );

//     if (!rows || rows.length === 0) {
//       console.error("No whiskermeter row found for user_id:", user_id);
//       return res.status(404).json({ error: "Whiskermeter record not found" });
//     }

//     const points = rows[0].points;
//     console.log("Points after update:", points);

//     // Determine badge
//     let newBadge = "Toe bean trainee";
//     if (points >= 500) newBadge = "The Catnip Captain";
//     else if (points >= 400) newBadge = "Meowtain Mover";
//     else if (points >= 200) newBadge = "Furmidable Friend";
//     else if (points >= 100) newBadge = "Snuggle Scout";

//     console.log("Badge to set:", newBadge);

//     // Update badge
//     const [updateBadgeResult] = await db.query(
//       "UPDATE users SET badge = ? WHERE user_id = ?",
//       [newBadge, user_id]
//     );
//     console.log("Badge update result:", updateBadgeResult);

//     res.json({ success: true, newPoints: points, badge: newBadge });
//   } catch (err) {
//     console.error("Error updating whiskermeter:", err.message);
//     res.status(500).json({ error: "Failed to update whiskermeter" });
//   }
// });




export default WhiskerMeterRoute;