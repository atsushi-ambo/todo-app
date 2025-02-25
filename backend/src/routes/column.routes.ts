import express from 'express';
import { 
  getColumns, 
  getColumn, 
  createColumn, 
  updateColumn, 
  deleteColumn,
  getColumnsByBoardId
} from '../controllers/column.controller';

const router = express.Router();

// GET all columns
router.get('/', getColumns);

// GET a single column
router.get('/:id', getColumn);

// GET columns by board ID
router.get('/board/:boardId', getColumnsByBoardId);

// POST a new column
router.post('/', createColumn);

// PUT update a column
router.put('/:id', updateColumn);

// DELETE a column
router.delete('/:id', deleteColumn);

export default router;