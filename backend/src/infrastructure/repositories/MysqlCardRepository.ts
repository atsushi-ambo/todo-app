import { Card, CardId } from '../../domain/entities/Card';
import { ColumnId } from '../../domain/entities/Column';
import { CardRepository, MoveCardParams } from '../../domain/repositories/CardRepository';
import { getPool, getPoolConnection, RowDataPacket, ResultSetHeader } from '../db/mysql';

export class MysqlCardRepository implements CardRepository {
  async findAll(): Promise<Card[]> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM cards ORDER BY position ASC'
    );

    return rows.map(row => new Card({
      id: row.id,
      columnId: row.column_id,
      title: row.title,
      description: row.description,
      position: row.position,
      createdAt: row.created_at
    }));
  }

  async findById(id: CardId): Promise<Card | null> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM cards WHERE id = ?', 
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return new Card({
      id: row.id,
      columnId: row.column_id,
      title: row.title,
      description: row.description,
      position: row.position,
      createdAt: row.created_at
    });
  }

  async findByColumnId(columnId: ColumnId): Promise<Card[]> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM cards WHERE column_id = ? ORDER BY position ASC', 
      [columnId]
    );

    return rows.map(row => new Card({
      id: row.id,
      columnId: row.column_id,
      title: row.title,
      description: row.description,
      position: row.position,
      createdAt: row.created_at
    }));
  }

  async save(card: Card): Promise<Card> {
    const pool = getPool();
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO cards (column_id, title, description, position) VALUES (?, ?, ?, ?)',
      [card.columnId, card.title, card.description, card.position]
    );

    // Return a new Card instance with the generated ID
    return new Card({
      id: result.insertId,
      columnId: card.columnId,
      title: card.title,
      description: card.description,
      position: card.position,
      createdAt: new Date()
    });
  }

  async update(card: Card): Promise<Card> {
    if (!card.id) {
      throw new Error('Cannot update a card without an ID');
    }

    const pool = getPool();
    await pool.query(
      'UPDATE cards SET title = ?, description = ?, position = ? WHERE id = ?',
      [card.title, card.description, card.position, card.id]
    );

    // Return the updated card
    return card;
  }

  async delete(id: CardId): Promise<void> {
    const pool = getPool();
    await pool.query('DELETE FROM cards WHERE id = ?', [id]);
  }

  async moveCard(params: MoveCardParams): Promise<Card> {
    const { cardId, sourceColumnId, destinationColumnId, position } = params;
    
    // Get a connection for transactions
    const connection = await getPoolConnection();
    
    try {
      // Start transaction
      await connection.beginTransaction();
      
      // Get the current card
      const [cards] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM cards WHERE id = ?',
        [cardId]
      );
      
      if (cards.length === 0) {
        throw new Error('Card not found');
      }
      
      const card = cards[0];
      const oldPosition = card.position;
      
      // Moving to a different column
      if (sourceColumnId !== destinationColumnId) {
        // Update positions in the source column
        await connection.query(
          'UPDATE cards SET position = position - 1 WHERE column_id = ? AND position > ?',
          [sourceColumnId, oldPosition]
        );
        
        // Update positions in the destination column
        await connection.query(
          'UPDATE cards SET position = position + 1 WHERE column_id = ? AND position >= ?',
          [destinationColumnId, position]
        );
      } else {
        // Moving within the same column
        if (position > oldPosition) {
          // Moving down
          await connection.query(
            'UPDATE cards SET position = position - 1 WHERE column_id = ? AND position > ? AND position <= ?',
            [sourceColumnId, oldPosition, position]
          );
        } else if (position < oldPosition) {
          // Moving up
          await connection.query(
            'UPDATE cards SET position = position + 1 WHERE column_id = ? AND position >= ? AND position < ?',
            [sourceColumnId, position, oldPosition]
          );
        }
      }
      
      // Update the card's column and position
      await connection.query(
        'UPDATE cards SET column_id = ?, position = ? WHERE id = ?',
        [destinationColumnId, position, cardId]
      );
      
      // Commit transaction
      await connection.commit();
      
      // Get the updated card
      const [updatedCards] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM cards WHERE id = ?',
        [cardId]
      );
      
      if (updatedCards.length === 0) {
        throw new Error('Card not found after update');
      }
      
      const updatedCard = updatedCards[0];
      
      return new Card({
        id: updatedCard.id,
        columnId: updatedCard.column_id,
        title: updatedCard.title,
        description: updatedCard.description,
        position: updatedCard.position,
        createdAt: updatedCard.created_at
      });
      
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    } finally {
      // Release connection
      connection.release();
    }
  }
  
  async reorderPositions(columnId: ColumnId, deletedPosition: number): Promise<void> {
    const pool = getPool();
    await pool.query(
      'UPDATE cards SET position = position - 1 WHERE column_id = ? AND position > ?',
      [columnId, deletedPosition]
    );
  }
}