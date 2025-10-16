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
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

let pool;
let connectorInstance;

export const connectDB = async () => {
  if (pool) return pool;

  const isProduction = process.env.NODE_ENV === 'production' || 
                      process.env.RENDER_EXTERNAL_HOSTNAME ||
                      process.env.CLOUD_SQL_INSTANCE;

  try {
    if (isProduction) {
      console.log("🌐 Using Cloud SQL Connector (ES6)...");
      
      // Create connector instance
      connectorInstance = new Connector();
      const connectionOptions = connectorInstance.getOptions({
        projectId: process.env.GOOGLE_CLOUD_PROJECT, // high-extension-474522-u0
        region: "asia-southeast1",
        instance: "whiskerwatch"
      });
      
      await connector.connect();
      
      pool = mysql.createPool({
        socketPath: connectionOptions.socketPath,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        acquireTimeout: 60000,
        timeout: 60000,
        connectTimeout: 60000
      });
    }

    // Test connection
    const connection = await pool.getConnection();
    console.log("Database connected successfully!");
    connection.release();
    
    return pool;
  } catch (err) {
    console.error("❌ Database connection error:", err);
    if (connector) {
      try {
        await connector.close();
      } catch (closeErr) {
        console.error("Error closing connector:", closeErr);
      }
    }
    throw err;
  }
};

export const getDB = () => {
  if (!pool) throw new Error("Database not connected. Call connectDB() first.");
  return pool;
};