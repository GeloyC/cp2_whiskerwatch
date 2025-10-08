import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

let db;
export async function connectDB() {
  try {
    const caCert = fs.readFileSync(new URL('./ca-certificate.crt', import.meta.url));

    db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 25060,
      ssl: {
        ca: caCert,
      },
    });

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
