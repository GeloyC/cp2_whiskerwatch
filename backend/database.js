import CloudSQLConnector  from '@google-cloud/cloud-sql-connector';
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

let pool;

export const connectDB = async () => {
  if (pool) return pool;

  const connector = new CloudSQLConnector();

  const clientOpts = await connector.getOptions({
    instanceConnectionName: 'high-extension-474522-u0:asia-southeast1:whiskerwatch',
    ipType: 'PUBLIC',
  });

  try {
    pool = mysql.createPool({
      ...clientOpts,
      // instanceConnectionName: 'high-extension-474522-u0:asia-southeast1:whiskerwatch',
      driver: 'mysql2',
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
        key: fs.readFileSync(path.join(process.cwd(), "config/client-key.pem")),
        cert: fs.readFileSync(path.join(process.cwd(), "config/client-cert.pem")),
        servername: undefined
      },

      acquireTimeout: 60000,
      connectTimeout: 60000,
      timeout: 60000,
    });

    console.log("Database connected successfully!");
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
