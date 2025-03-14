import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Infrastructure
import { connectToDatabase } from './infrastructure/db/mysql';
import { MysqlBoardRepository } from './infrastructure/repositories/MysqlBoardRepository';
import { MysqlColumnRepository } from './infrastructure/repositories/MysqlColumnRepository';
import { MysqlCardRepository } from './infrastructure/repositories/MysqlCardRepository';

// Application
import { BoardUseCase } from './application/useCases/BoardUseCase';
import { ColumnUseCase } from './application/useCases/ColumnUseCase';
import { CardUseCase } from './application/useCases/CardUseCase';

// Interface
import { BoardController } from './interfaces/controllers/board.controller';
import { ColumnController } from './interfaces/controllers/column.controller';
import { CardController } from './interfaces/controllers/card.controller';
import { createBoardRouter } from './interfaces/routes/board.routes';
import { createColumnRouter } from './interfaces/routes/column.routes';
import { createCardRouter } from './interfaces/routes/card.routes';

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

// Dependency injection setup
const setupRoutes = () => {
  // Repositories
  const boardRepository = new MysqlBoardRepository();
  const columnRepository = new MysqlColumnRepository();
  const cardRepository = new MysqlCardRepository();

  // Use cases
  const boardUseCase = new BoardUseCase(boardRepository, columnRepository);
  const columnUseCase = new ColumnUseCase(columnRepository, cardRepository);
  const cardUseCase = new CardUseCase(cardRepository);

  // Controllers
  const boardController = new BoardController(boardUseCase);
  const columnController = new ColumnController(columnUseCase);
  const cardController = new CardController(cardUseCase);

  // Routes
  app.use('/api/boards', createBoardRouter(boardController));
  app.use('/api/columns', createColumnRouter(columnController));
  app.use('/api/cards', createCardRouter(cardController));
};

// Base route
app.get('/', (req, res) => {
  res.send('Todo App API - Clean Architecture');
});

// Start server
const startServer = async () => {
  try {
    await connectToDatabase();
    setupRoutes();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();