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
    // Create connector with explicit configuration
    connectorInstance = new Connector();
    
    const instanceConnectionName = `${process.env.GOOGLE_CLOUD_PROJECT}:asia-southeast1:whiskerwatch`;
    console.log(`📍 Instance connection name: ${instanceConnectionName}`);
    
    // Get connection options - this should start the proxy
    const connectionOptions = connectorInstance.getOptions({
      instanceConnectionName: instanceConnectionName
    });

    console.log("🔌 Socket path:", connectionOptions.socketPath);
    console.log("📡 Connection options:", JSON.stringify(connectionOptions, null, 2));

    // Verify socket path exists and is valid
    if (!connectionOptions.socketPath) {
      throw new Error("Connector failed to provide socket path - proxy not started");
    }

    // Create MySQL pool with Unix socket
    pool = mysql.createPool({
      socketPath: connectionOptions.socketPath, // Unix socket, NOT TCP
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4'
    });

    // Test connection with longer timeout
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully via Cloud SQL Connector!");
    console.log(`📊 Connected to database: ${process.env.DB_NAME}`);
    connection.release();
    
    return pool;
  } catch (err) {
    console.error("❌ Database connection error:", err);
    
    // Debug: Check if connector started properly
    if (connectorInstance) {
      console.error("Connector instance:", connectorInstance);
    }
    
    throw err;
  }
};

export const getDB = () => {
  if (!pool) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return pool;
};