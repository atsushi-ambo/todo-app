import { Request, Response } from 'express';
import { getConnection, getPoolConnection } from '../db/connection';
import { Card } from '../models/interfaces';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2/promise';

// Get all cards
export const getCards = async (req: Request, res: Response) => {
  try {
    const connection = getConnection();
    const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM cards ORDER BY position ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
};

// Get cards by column ID
export const getCardsByColumnId = async (req: Request, res: Response) => {
  try {
    const { columnId } = req.params;
    const connection = getConnection();
    
    const [cards] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM cards WHERE column_id = ? ORDER BY position ASC', 
      [columnId]
    );
    
    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards by column ID:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
};

// Get a single card
export const getCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = getConnection();
    
    const [cards] = await connection.query<RowDataPacket[]>('SELECT * FROM cards WHERE id = ?', [id]);
    
    if (cards.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    res.json(cards[0]);
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ error: 'Failed to fetch card' });
  }
};

// Create a new card
export const createCard = async (req: Request, res: Response) => {
  try {
    const { column_id, title, description = '' } = req.body;
    
    if (!column_id || !title) {
      return res.status(400).json({ error: 'Column ID and title are required' });
    }
    
    const connection = getConnection();
    
    // Get the highest position value for the column
    const [positions] = await connection.query<RowDataPacket[]>(
      'SELECT MAX(position) as maxPosition FROM cards WHERE column_id = ?',
      [column_id]
    );
    
    const maxPosition = positions[0].maxPosition !== null ? positions[0].maxPosition : -1;
    const newPosition = maxPosition + 1;
    
    const [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO cards (column_id, title, description, position) VALUES (?, ?, ?, ?)',
      [column_id, title, description, newPosition]
    );
    
    const id = result.insertId;
    
    res.status(201).json({ 
      id, 
      column_id, 
      title, 
      description,
      position: newPosition,
      message: 'Card created successfully' 
    });
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ error: 'Failed to create card' });
  }
};

// Update a card
export const updateCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, position } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Card title is required' });
    }
    
    const connection = getConnection();
    let query = 'UPDATE cards SET title = ?, description = ?';
    const params = [title, description || ''];
    
    if (position !== undefined) {
      query += ', position = ?';
      params.push(position);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    const [result] = await connection.query<ResultSetHeader>(query, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    res.json({ 
      id, 
      title, 
      description, 
      position,
      message: 'Card updated successfully' 
    });
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Failed to update card' });
  }
};

// Move a card to a different column or position
export const moveCard = async (req: Request, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    const { column_id, position } = req.body;
    
    if (!column_id || position === undefined) {
      return res.status(400).json({ error: 'Column ID and position are required' });
    }
    
    // Get a connection for transactions
    connection = await getPoolConnection();
    
    // First, get the current card information
    const [cards] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM cards WHERE id = ?',
      [id]
    );
    
    if (cards.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    const card = cards[0] as Card & RowDataPacket;
    const oldColumnId = card.column_id;
    const oldPosition = card.position;
    
    // Start a transaction
    await connection.beginTransaction();
    
    try {
      // If moving to a different column
      if (oldColumnId !== column_id) {
        // Update positions in the old column
        await connection.query(
          'UPDATE cards SET position = position - 1 WHERE column_id = ? AND position > ?',
          [oldColumnId, oldPosition]
        );
        
        // Update positions in the new column to make space
        await connection.query(
          'UPDATE cards SET position = position + 1 WHERE column_id = ? AND position >= ?',
          [column_id, position]
        );
      } else {
        // Moving within the same column
        if (position > oldPosition) {
          // Moving down
          await connection.query(
            'UPDATE cards SET position = position - 1 WHERE column_id = ? AND position > ? AND position <= ?',
            [column_id, oldPosition, position]
          );
        } else if (position < oldPosition) {
          // Moving up
          await connection.query(
            'UPDATE cards SET position = position + 1 WHERE column_id = ? AND position >= ? AND position < ?',
            [column_id, position, oldPosition]
          );
        }
      }
      
      // Move the card to its new position
      await connection.query(
        'UPDATE cards SET column_id = ?, position = ? WHERE id = ?',
        [column_id, position, id]
      );
      
      await connection.commit();
      
      // Get the updated card
      const [updatedCards] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM cards WHERE id = ?',
        [id]
      );
      
      if (updatedCards.length === 0) {
        throw new Error('Card not found after update');
      }
      
      const updatedCard = updatedCards[0];
      res.json({
        ...updatedCard,
        message: 'Card moved successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error moving card:', error);
    res.status(500).json({ error: 'Failed to move card' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Delete a card
export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = getConnection();
    
    // First, get the card to find its column_id and position
    const [cards] = await connection.query<RowDataPacket[]>('SELECT * FROM cards WHERE id = ?', [id]);
    
    if (cards.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    const card = cards[0] as Card & RowDataPacket;
    
    // Delete the card
    await connection.query('DELETE FROM cards WHERE id = ?', [id]);
    
    // Reorder the positions of remaining cards
    await connection.query(
      'UPDATE cards SET position = position - 1 WHERE column_id = ? AND position > ?',
      [card.column_id, card.position]
    );
    
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: 'Failed to delete card' });
  }
};