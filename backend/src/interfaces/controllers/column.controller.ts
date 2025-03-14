import { Request, Response } from 'express';
import { ColumnUseCase } from '../../application/useCases/ColumnUseCase';
import { CreateColumnDTO, UpdateColumnDTO } from '../../application/dtos/column.dto';

export class ColumnController {
  constructor(private columnUseCase: ColumnUseCase) {}

  getColumns = async (req: Request, res: Response) => {
    try {
      const columns = await this.columnUseCase.getAllColumns();
      res.json(columns);
    } catch (error) {
      console.error('Error fetching columns:', error);
      res.status(500).json({ error: 'Failed to fetch columns' });
    }
  };

  getColumnsByBoardId = async (req: Request, res: Response) => {
    try {
      const { boardId } = req.params;
      const columns = await this.columnUseCase.getColumnsByBoardId(Number(boardId));
      res.json(columns);
    } catch (error) {
      console.error('Error fetching columns by board ID:', error);
      res.status(500).json({ error: 'Failed to fetch columns' });
    }
  };

  getColumn = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const column = await this.columnUseCase.getColumnWithCards(Number(id));
      
      if (!column) {
        return res.status(404).json({ error: 'Column not found' });
      }
      
      res.json(column);
    } catch (error) {
      console.error('Error fetching column:', error);
      res.status(500).json({ error: 'Failed to fetch column' });
    }
  };

  createColumn = async (req: Request, res: Response) => {
    try {
      const { board_id, name } = req.body;
      
      if (!board_id || !name) {
        return res.status(400).json({ error: 'Board ID and column name are required' });
      }
      
      const columnData: CreateColumnDTO = { 
        boardId: Number(board_id),
        name 
      };
      
      const column = await this.columnUseCase.createColumn(columnData);
      res.status(201).json({ ...column, message: 'Column created successfully' });
    } catch (error) {
      console.error('Error creating column:', error);
      res.status(500).json({ error: 'Failed to create column' });
    }
  };

  updateColumn = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, position } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Column name is required' });
      }
      
      const columnData: UpdateColumnDTO = { 
        name
      };
      
      if (position !== undefined) {
        columnData.position = Number(position);
      }
      
      const column = await this.columnUseCase.updateColumn(Number(id), columnData);
      
      if (!column) {
        return res.status(404).json({ error: 'Column not found' });
      }
      
      res.json({ ...column, message: 'Column updated successfully' });
    } catch (error) {
      console.error('Error updating column:', error);
      res.status(500).json({ error: 'Failed to update column' });
    }
  };

  deleteColumn = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.columnUseCase.deleteColumn(Number(id));
      
      if (!success) {
        return res.status(404).json({ error: 'Column not found' });
      }
      
      res.json({ message: 'Column deleted successfully' });
    } catch (error) {
      console.error('Error deleting column:', error);
      res.status(500).json({ error: 'Failed to delete column' });
    }
  };
}