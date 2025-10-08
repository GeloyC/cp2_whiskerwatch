// hashPasswords.js
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// MySQL connection configuration (match your .env or backend settings)
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Password123",
  database: process.env.DB_NAME || "whiskerwatch",
};

// User data from the provided users table
const users = [
  { user_id: 1, password: "Cabangal10" },
  { user_id: 4, password: "johnwick" },
  { user_id: 5, password: "misterbean" },
  { user_id: 6, password: "Bayola1850" },
  { user_id: 7, password: "cabangal" },
];

async function hashAndUpdatePasswords() {
  let db;
  try {
    // Connect to the database
    db = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL database!");

    // Hash and update each user's password
    for (const user of users) {
      const hash = await bcrypt.hash(user.password, 10);
      await db.query("UPDATE users SET password = ? WHERE user_id = ?", [
        hash,
        user.user_id,
      ]);
      console.log(
        `Updated user_id ${user.user_id}: Password '${user.password}' -> Hash '${hash}'`
      );
    }

    console.log("All passwords updated successfully.");
  } catch (err) {
    console.error("Error updating passwords:", err);
  } finally {
    // Close the database connection
    if (db) await db.end();
    console.log("Database connection closed.");
  }
}

// Run the script
hashAndUpdatePasswords();
