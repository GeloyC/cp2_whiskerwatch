// import mysql from "mysql2/promise";
// import { CloudSqlSocket } from "@google-cloud/cloud-sql-connector";
// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";

// dotenv.config();

// let pool;
// let connector;

// export const connectDB = async () => {
//   if (pool) return pool;

//   try {
//     const useCloudSQLConnector = 
//       process.env.NODE_ENV === 'production' || 
//       process.env.CLOUD_SQL_INSTANCE;

//     pool = mysql.createPool({
//       host: '127.0.0.1', // proxy
//       // host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD, // make sure you have this in your .env
//       database: process.env.DB_NAME,
//       port: process.env.DB_PORT || 3307,
//       waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0,
//       // ssl: {
//       //   ca: fs.readFileSync(path.join(process.cwd(), "config/server-ca.pem")),
//       //   key: fs.readFileSync(path.join(process.cwd(), "config/client-key.pem")),
//       //   cert: fs.readFileSync(path.join(process.cwd(), "config/client-cert.pem")),
//       // },
//     });

//     console.log("Database connected successfully!");
//     return pool;
//   } catch (err) {
//     console.error("Database connection error:", err);
//     throw err;
//   }
// };

// export const getDB = () => {
//   if (!pool) {
//     throw new Error("Database not connected. Call connectDB() first.");
//   }
//   return pool;
// };
import mysql from "mysql2/promise";
import { Connector } from "@google-cloud/cloud-sql-connector";
import dotenv from "dotenv";

dotenv.config();

let pool;
let connectorInstance;

export const connectDB = async () => {
  if (pool) return pool;

  console.log("🌐 Initializing Cloud SQL Connector...");
  
  try {
    // Create connector instance
    connectorInstance = new Connector();
    
    // Fix: Use full "PROJECT:REGION:INSTANCE" format
    const instanceConnectionName = `${process.env.GOOGLE_CLOUD_PROJECT}:asia-southeast1:whiskerwatch`;
    
    const connectionOptions = connectorInstance.getOptions({
      instanceConnectionName: instanceConnectionName, // ✅ Full connection string
      // Remove separate projectId, region, instance - use instanceConnectionName instead
    });

    console.log(`📍 Using instance: ${instanceConnectionName}`);

    // Fix MySQL2 pool options - remove invalid options
    pool = mysql.createPool({
      socketPath: connectionOptions.socketPath,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // Remove invalid options: acquireTimeout, timeout, connectTimeout
      // mysql2 handles these internally
      charset: 'utf8mb4',
      supportBigNumbers: true,
      bigNumberStrings: true
    });

    // Test connection
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully via Cloud SQL Connector!");
    console.log(`📊 Connected to database: ${process.env.DB_NAME}`);
    connection.release();
    
    return pool;
  } catch (err) {
    console.error("❌ Database connection error:", err);
    throw err;
  }
};

export const closeDB = async () => {
  if (pool) {
    try {
      await pool.end();
      console.log("Database pool closed");
    } catch (error) {
      console.error("Error closing pool:", error);
    }
  }
};

export const getDB = () => {
  if (!pool) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return pool;
};