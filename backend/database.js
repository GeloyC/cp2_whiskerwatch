import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const ca = fs.readFileSync('./config/ca-certificate.crt');

// Load environment variables
dotenv.config();

let db;
export async function connectDB() {
  try {
    db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 25060,
    ssl: { ca },
});
    console.log('Connected to MySQL database!');
  } catch (err) {
    console.error('Failed to connect to MySQL:', err);
    process.exit(1);
  }
}


// Initialize the connection
export function getDB() {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
}

