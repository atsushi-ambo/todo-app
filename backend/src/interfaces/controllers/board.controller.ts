import { Request, Response } from 'express';
import { BoardUseCase } from '../../application/useCases/BoardUseCase';
import { CreateBoardDTO, UpdateBoardDTO } from '../../application/dtos/board.dto';

export class BoardController {
  constructor(private boardUseCase: BoardUseCase) {}

  getBoards = async (req: Request, res: Response) => {
    try {
      const boards = await this.boardUseCase.getAllBoards();
      res.json(boards);
    } catch (error) {
      console.error('Error fetching boards:', error);
      res.status(500).json({ error: 'Failed to fetch boards' });
    }
  };

  getBoard = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const board = await this.boardUseCase.getBoardWithColumns(Number(id));
      
      if (!board) {
        return res.status(404).json({ error: 'Board not found' });
      }
      
      res.json(board);
    } catch (error) {
      console.error('Error fetching board:', error);
      res.status(500).json({ error: 'Failed to fetch board' });
    }
  };

  createBoard = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Board name is required' });
      }
      
      const boardData: CreateBoardDTO = { name };
      const board = await this.boardUseCase.createBoard(boardData);
      
      res.status(201).json({ ...board, message: 'Board created successfully' });
    } catch (error) {
      console.error('Error creating board:', error);
      res.status(500).json({ error: 'Failed to create board' });
    }
  };

  updateBoard = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Board name is required' });
      }
      
      const boardData: UpdateBoardDTO = { name };
      const board = await this.boardUseCase.updateBoard(Number(id), boardData);
      
      if (!board) {
        return res.status(404).json({ error: 'Board not found' });
      }
      
      res.json({ ...board, message: 'Board updated successfully' });
    } catch (error) {
      console.error('Error updating board:', error);
      res.status(500).json({ error: 'Failed to update board' });
    }
  };

  deleteBoard = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.boardUseCase.deleteBoard(Number(id));
      
      if (!success) {
        return res.status(404).json({ error: 'Board not found' });
      }
      
      res.json({ message: 'Board deleted successfully' });
    } catch (error) {
      console.error('Error deleting board:', error);
      res.status(500).json({ error: 'Failed to delete board' });
    }
  };
}