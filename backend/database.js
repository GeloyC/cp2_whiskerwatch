import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

let db;
export async function connectDB() {
  try {
    db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 3306,
      ssl: {
        ca: fs.readFileSync(path.resolve('./config/server-ca.pem'))
      },
    });

    console.log("DB object:", db);

    console.log('✅ Connected to MySQL database!');
  } catch (err) {
    console.error('❌ Failed to connect to MySQL:', err);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
}
