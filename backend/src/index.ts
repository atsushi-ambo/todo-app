import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import boardRoutes from './routes/board.routes';
import columnRoutes from './routes/column.routes';
import cardRoutes from './routes/card.routes';
import { connectToDatabase } from './db/connection';

// Load environment variables
dotenv.config();

// Initialize express
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/cards', cardRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Trello Clone API');
});

// Start server
const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();