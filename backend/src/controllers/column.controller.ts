import { Request, Response } from 'express';
import { getConnection } from '../db/connection';
import { Column } from '../models/interfaces';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2/promise';

// Get all columns
export const getColumns = async (req: Request, res: Response) => {
  try {
    const connection = getConnection();
    const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM columns ORDER BY position ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching columns:', error);
    res.status(500).json({ error: 'Failed to fetch columns' });
  }
};

// Get columns by board ID
export const getColumnsByBoardId = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const connection = getConnection();
    
    // Get columns for this board
    const [columns] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM columns WHERE board_id = ? ORDER BY position ASC',
      [boardId]
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
    
    res.json(columnsWithCards);
  } catch (error) {
    console.error('Error fetching columns by board ID:', error);
    res.status(500).json({ error: 'Failed to fetch columns' });
  }
};

// Get a single column
export const getColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = getConnection();
    
    const [columns] = await connection.query<RowDataPacket[]>('SELECT * FROM columns WHERE id = ?', [id]);
    
    if (columns.length === 0) {
      return res.status(404).json({ error: 'Column not found' });
    }
    
    const column = columns[0];
    
    // Get cards for this column
    const [cards] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM cards WHERE column_id = ? ORDER BY position ASC',
      [id]
    );
    
    res.json({ ...column, cards });
  } catch (error) {
    console.error('Error fetching column:', error);
    res.status(500).json({ error: 'Failed to fetch column' });
  }
};

// Create a new column
export const createColumn = async (req: Request, res: Response) => {
  try {
    const { board_id, name } = req.body;
    
    if (!board_id || !name) {
      return res.status(400).json({ error: 'Board ID and column name are required' });
    }
    
    const connection = getConnection();
    
    // Get the highest position value for the board
    const [positions] = await connection.query<RowDataPacket[]>(
      'SELECT MAX(position) as maxPosition FROM columns WHERE board_id = ?',
      [board_id]
    );
    
    const maxPosition = positions[0].maxPosition !== null ? positions[0].maxPosition : -1;
    const newPosition = maxPosition + 1;
    
    const [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO columns (board_id, name, position) VALUES (?, ?, ?)',
      [board_id, name, newPosition]
    );
    
    const id = result.insertId;
    
    res.status(201).json({ 
      id, 
      board_id, 
      name, 
      position: newPosition,
      message: 'Column created successfully' 
    });
  } catch (error) {
    console.error('Error creating column:', error);
    res.status(500).json({ error: 'Failed to create column' });
  }
};

// Update a column
export const updateColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, position } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Column name is required' });
    }
    
    const connection = getConnection();
    let query = 'UPDATE columns SET name = ?';
    const params = [name];
    
    if (position !== undefined) {
      query += ', position = ?';
      params.push(position);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    const [result] = await connection.query<ResultSetHeader>(query, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Column not found' });
    }
    
    res.json({ id, name, position, message: 'Column updated successfully' });
  } catch (error) {
    console.error('Error updating column:', error);
    res.status(500).json({ error: 'Failed to update column' });
  }
};

// Delete a column
export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = getConnection();
    
    // First, get the column to find its board_id and position
    const [columns] = await connection.query<RowDataPacket[]>('SELECT * FROM columns WHERE id = ?', [id]);
    
    if (columns.length === 0) {
      return res.status(404).json({ error: 'Column not found' });
    }
    
    const column = columns[0] as Column & RowDataPacket;
    
    // Delete the column
    await connection.query('DELETE FROM columns WHERE id = ?', [id]);
    
    // Reorder the positions of remaining columns
    await connection.query(
      'UPDATE columns SET position = position - 1 WHERE board_id = ? AND position > ?',
      [column.board_id, column.position]
    );
    
    res.json({ message: 'Column deleted successfully' });
  } catch (error) {
    console.error('Error deleting column:', error);
    res.status(500).json({ error: 'Failed to delete column' });
  }
};