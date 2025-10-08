import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

let db;
export async function connectDB() {
  try {
    db = await mysql.createPool({
      host: process.env.DB_HOST || 'df-mysql-whiskerwatch-do-user-27125628-0.f.db.ondigitalocean.com',
      user: process.env.DB_USER || 'doadmin',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'whiskerwatch',
      port: parseInt(process.env.DB_PORT) || 25060,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        ca: process.env.DB_CA_CERT  // Path to or content of ca-certificate.crt
      }
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

