import express from 'express';
import { getBoards, getBoard, createBoard, updateBoard, deleteBoard } from '../controllers/board.controller';

const router = express.Router();

// GET all boards
router.get('/', getBoards);

// GET a single board
router.get('/:id', getBoard);

// POST a new board
router.post('/', createBoard);

// PUT update a board
router.put('/:id', updateBoard);

// DELETE a board
router.delete('/:id', deleteBoard);

export default router;