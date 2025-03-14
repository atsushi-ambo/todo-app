import express from 'express';
import { ColumnController } from '../controllers/column.controller';

export const createColumnRouter = (columnController: ColumnController) => {
  const router = express.Router();

  // GET all columns
  router.get('/', columnController.getColumns);
  
  // GET columns by board ID
  router.get('/board/:boardId', columnController.getColumnsByBoardId);
  
  // GET a single column with its cards
  router.get('/:id', columnController.getColumn);
  
  // POST create a new column
  router.post('/', columnController.createColumn);
  
  // PUT update a column
  router.put('/:id', columnController.updateColumn);
  
  // DELETE a column
  router.delete('/:id', columnController.deleteColumn);

  return router;
};