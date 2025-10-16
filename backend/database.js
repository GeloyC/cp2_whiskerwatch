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




// import mysql from "mysql2/promise";
// import { Connector } from "@google-cloud/cloud-sql-connector";
// import dotenv from "dotenv";

// dotenv.config();

// let pool;
// let connectorInstance;

// export const connectDB = async () => {
//   if (pool) return pool;

//   console.log("🌐 Initializing Cloud SQL Connector...");
  
//   try {
//     // Create connector with explicit configuration
//     connectorInstance = new Connector();
    
//     const instanceConnectionName = `${process.env.GOOGLE_CLOUD_PROJECT}:asia-southeast1:whiskerwatch`;
//     console.log(`📍 Instance connection name: ${instanceConnectionName}`);
    
//     // Get connection options - this should start the proxy
//     const connectionOptions = connectorInstance.getOptions({
//       instanceConnectionName: instanceConnectionName
//     });

//     console.log("🔌 Socket path:", connectionOptions.socketPath);
//     console.log("📡 Connection options:", JSON.stringify(connectionOptions, null, 2));

//     // Verify socket path exists and is valid
//     if (!connectionOptions.socketPath) {
//       throw new Error("Connector failed to provide socket path - proxy not started");
//     }

//     // Create MySQL pool with Unix socket
//     pool = mysql.createPool({
//       socketPath: connectionOptions.socketPath, // Unix socket, NOT TCP
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0,
//       charset: 'utf8mb4'
//     });

//     // Test connection with longer timeout
//     const connection = await pool.getConnection();
//     console.log("✅ Database connected successfully via Cloud SQL Connector!");
//     console.log(`📊 Connected to database: ${process.env.DB_NAME}`);
//     connection.release();
    

//     console.log("🔑 Checking authentication...");
//     console.log("Project ID:", process.env.GOOGLE_CLOUD_PROJECT);
//     console.log("Credentials length:", process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.length || 0);
//     console.log("DB_USER:", process.env.DB_USER ? "Set" : "Missing");
//     console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "Set" : "Missing");
//     console.log("DB_NAME:", process.env.DB_NAME || "Missing");

//     try {
//       const { GoogleAuth } = await import('google-auth-library');
//       const auth = new GoogleAuth();
//       const projectId = await auth.getProjectId();
//       console.log("✅ Google Auth working, project:", projectId);
//     } catch (authError) {
//       console.error("❌ Google Auth failed:", authError.message);
//     }

//     return pool;
//   } catch (err) {
//     console.error("❌ Database connection error:", err);
    
//     // Debug: Check if connector started properly
//     if (connectorInstance) {
//       console.error("Connector instance:", connectorInstance);
//     }
    
//     throw err;
//   }
// };

// export const getDB = () => {
//   if (!pool) {
//     throw new Error("Database not connected. Call connectDB() first.");
//   }
//   return pool;
// };



// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// let pool;

// export const connectDB = async () => {
//   if (pool) return pool;

//   console.log("🌐 Connecting via Public IP (Render Free Tier)...");
  
//   pool = mysql.createPool({
//     host: '35.240.135.236', // Your Cloud SQL public IP
//     port: 3306,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     ssl: {
//       rejectUnauthorized: false // Bypasses SNI/TLS issues
//     },
//     connectionLimit: 5,
//     connectTimeout: 10000
//   });

//   // Test connection
//   await pool.query('SELECT 1');
//   console.log("✅ Connected via public IP!");
//   return pool;
// };

// export const getDB = () => {
//   if (!pool) {
//     throw new Error("Database not connected. Call connectDB() first.");
//   }
//   return pool;
// };



import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

let pool;

export const connectDB = async () => {
  if (pool) return pool;

  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD, // make sure you have this in your .env
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        ca: fs.readFileSync(path.join(process.cwd(), "config/server-ca.pem")),
        // key: fs.readFileSync(path.join(process.cwd(), "config/client-key.pem")),
        // cert: fs.readFileSync(path.join(process.cwd(), "config/client-cert.pem")),
        rejectUnauthorized: true,
        servername: 'mysql.googleapis.com'
      },
    });

    console.log("Database connected successfully and truthfully!");
    return pool;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};

export const getDB = () => {
  if (!pool) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return pool;
};


// import mysql from "mysql2/promise";
// import { Connector } from "@google-cloud/cloud-sql-connector";
// import dotenv from "dotenv";

// dotenv.config();

// let pool;
// let connectorInstance;

// export const connectDB = async () => {
//   if (pool) return pool;

//   console.log("🌐 Initializing Cloud SQL Connector (Render Paid Plan)...");
  
//   try {
//     // Debug: Verify environment
//     console.log("🔍 Environment check:");
//     console.log("- Project:", process.env.GOOGLE_CLOUD_PROJECT);
//     console.log("- User:", process.env.DB_USER ? "Set" : "Missing");
//     console.log("- Database:", process.env.DB_NAME || "Missing");
//     console.log("- Credentials:", process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ? "Set" : "Missing");

//     // Create connector instance
//     connectorInstance = new Connector();
    
//     // Full instance connection name
//     const instanceConnectionName = `${process.env.GOOGLE_CLOUD_PROJECT}:asia-southeast1:whiskerwatch`;
//     console.log(`📍 Instance: ${instanceConnectionName}`);
    
//     // Get secure Unix socket connection
//     const connectionOptions = connectorInstance.getOptions({
//       instanceConnectionName: instanceConnectionName
//     });

//     console.log("🔌 Unix socket:", connectionOptions.socketPath);

//     // Production-optimized connection pool
//     pool = mysql.createPool({
//       socketPath: connectionOptions.socketPath,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0,
//       // Production timeouts
//       acquireTimeout: 60000,
//       timeout: 60000,
//       idleTimeout: 600000, // 10 minutes
//       // Reliability settings
//       reconnect: true,
//       charset: 'utf8mb4',
//       timezone: '+00:00',
//       // Security
//       ssl: undefined // Connector handles encryption
//     });

//     // Test with real query
//     const [result] = await pool.query('SELECT DATABASE() as db, CONNECTION_ID() as conn_id');
//     console.log("✅ Cloud SQL Connector connected!");
//     console.log(`📊 DB: ${result[0].db}, Connection: ${result[0].conn_id}`);
    
//     return pool;
//   } catch (error) {
//     console.error("❌ Cloud SQL Connector failed:", error);
    
//     // Emergency fallback to public IP
//     console.log("🔄 Emergency fallback to public IP...");
//     return createPublicFallback();
//   }
// };

// // Emergency public IP fallback
// const createPublicFallback = async () => {
//   const fallbackPool = mysql.createPool({
//     host: '35.240.135.236',
//     port: 3306,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     ssl: {
//       rejectUnauthorized: false,
//       checkServerIdentity: () => undefined
//     },
//     connectionLimit: 5,
//     connectTimeout: 30000
//   });

//   await fallbackPool.query('SELECT 1');
//   console.log("✅ Public IP fallback active!");
//   return fallbackPool;
// };

// export const closeDB = async () => {
//   if (pool) {
//     try {
//       await pool.end();
//       console.log("Database pool closed");
//     } catch (error) {
//       console.error("Error closing pool:", error);
//     }
//   }
// };

// export const getDB = () => {
//   if (!pool) throw new Error("Database not connected.");
//   return pool;
// };