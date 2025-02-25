import * as mysql from 'mysql2/promise';
import { RowDataPacket, OkPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';

// Database connection pool
let pool: mysql.Pool;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const connectToDatabase = async (retries = 5) => {
  while (retries > 0) {
    try {
      pool = mysql.createPool({
        host: process.env.MYSQL_HOST || 'mysql',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'password',
        database: process.env.MYSQL_DATABASE || 'trello_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // Test the connection
      await pool.getConnection();
      console.log('Connected to MySQL database');
      return pool;
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error('Failed to connect to MySQL after multiple retries:', error);
        throw error;
      }
      console.log(`Failed to connect to MySQL. Retrying in 5 seconds... (${retries} attempts left)`);
      await delay(5000);
    }
  }
};

export const getConnection = () => {
  if (!pool) {
    throw new Error('Database connection not established');
  }
  return pool;
};

// Helper to get a connection from pool for transactions
export const getPoolConnection = async (): Promise<PoolConnection> => {
  if (!pool) {
    throw new Error('Database connection not established');
  }
  return await pool.getConnection();
};

// Type exports for use in controllers
export type { RowDataPacket, OkPacket, ResultSetHeader, PoolConnection };