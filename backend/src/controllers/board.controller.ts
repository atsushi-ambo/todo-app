import { Request, Response } from 'express';
import { getConnection } from '../db/connection';
import { Board } from '../models/interfaces';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2/promise';

// Get all boards
export const getBoards = async (req: Request, res: Response) => {
  try {
    const connection = getConnection();
    const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM boards ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
};

// Get a single board with its columns and cards
export const getBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = getConnection();
    
    // Get the board details
    const [boards] = await connection.query<RowDataPacket[]>('SELECT * FROM boards WHERE id = ?', [id]);
    
    if (boards.length === 0) {
      return res.status(404).json({ error: 'Board not found' });
    }
    
    const board = boards[0];
    
    // Get the columns for this board
    const [columns] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM columns WHERE board_id = ? ORDER BY position ASC', 
      [id]
    );
    
    // For each column, get its cards
    const columnsWithCards = await Promise.all(
      columns.map(async (column) => {
        const [cards] = await connection.query<RowDataPacket[]>(
          'SELECT * FROM cards WHERE column_id = ? ORDER BY position ASC', 
          [column.id]
        );
        return { ...column, cards };
      })
    );
    
    res.json({ ...board, columns: columnsWithCards });
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({ error: 'Failed to fetch board' });
  }
};

// Create a new board
export const createBoard = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Board name is required' });
    }
    
    const connection = getConnection();
    const [result] = await connection.query<ResultSetHeader>('INSERT INTO boards (name) VALUES (?)', [name]);
    const id = result.insertId;
    
    // Create default columns for new board
    const defaultColumns = [
      { name: 'To Do', position: 0 },
      { name: 'In Progress', position: 1 },
      { name: 'Done', position: 2 }
    ];
    
    for (const column of defaultColumns) {
      await connection.query(
        'INSERT INTO columns (board_id, name, position) VALUES (?, ?, ?)', 
        [id, column.name, column.position]
      );
    }
    
    res.status(201).json({ id, name, message: 'Board created successfully' });
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ error: 'Failed to create board' });
  }
};

// Update a board
export const updateBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Board name is required' });
    }
    
    const connection = getConnection();
    const [result] = await connection.query<ResultSetHeader>('UPDATE boards SET name = ? WHERE id = ?', [name, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Board not found' });
    }
    
    res.json({ id, name, message: 'Board updated successfully' });
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({ error: 'Failed to update board' });
  }
};

// Delete a board
export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = getConnection();
    
    const [result] = await connection.query<ResultSetHeader>('DELETE FROM boards WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Board not found' });
    }
    
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
};