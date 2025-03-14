import express from 'express';
import { BoardController } from '../controllers/board.controller';

export const createBoardRouter = (boardController: BoardController) => {
  const router = express.Router();

  // GET all boards
  router.get('/', boardController.getBoards);
  
  // GET a single board with its columns and cards
  router.get('/:id', boardController.getBoard);
  
  // POST create a new board
  router.post('/', boardController.createBoard);
  
  // PUT update a board
  router.put('/:id', boardController.updateBoard);
  
  // DELETE a board
  router.delete('/:id', boardController.deleteBoard);

  return router;
};