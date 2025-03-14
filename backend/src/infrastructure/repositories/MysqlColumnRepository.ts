import { Column, ColumnId } from '../../domain/entities/Column';
import { BoardId } from '../../domain/entities/Board';
import { ColumnRepository } from '../../domain/repositories/ColumnRepository';
import { getPool, RowDataPacket, ResultSetHeader } from '../db/mysql';

export class MysqlColumnRepository implements ColumnRepository {
  async findAll(): Promise<Column[]> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM columns ORDER BY position ASC'
    );

    return rows.map(row => new Column({
      id: row.id,
      boardId: row.board_id,
      name: row.name,
      position: row.position,
      createdAt: row.created_at
    }));
  }

  async findById(id: ColumnId): Promise<Column | null> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM columns WHERE id = ?', 
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return new Column({
      id: row.id,
      boardId: row.board_id,
      name: row.name,
      position: row.position,
      createdAt: row.created_at
    });
  }

  async findByBoardId(boardId: BoardId): Promise<Column[]> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM columns WHERE board_id = ? ORDER BY position ASC', 
      [boardId]
    );

    return rows.map(row => new Column({
      id: row.id,
      boardId: row.board_id,
      name: row.name,
      position: row.position,
      createdAt: row.created_at
    }));
  }

  async save(column: Column): Promise<Column> {
    const pool = getPool();
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO columns (board_id, name, position) VALUES (?, ?, ?)',
      [column.boardId, column.name, column.position]
    );

    // Return a new Column instance with the generated ID
    return new Column({
      id: result.insertId,
      boardId: column.boardId,
      name: column.name,
      position: column.position,
      createdAt: new Date()
    });
  }

  async update(column: Column): Promise<Column> {
    if (!column.id) {
      throw new Error('Cannot update a column without an ID');
    }

    const pool = getPool();
    await pool.query(
      'UPDATE columns SET name = ?, position = ? WHERE id = ?',
      [column.name, column.position, column.id]
    );

    // Return the updated column
    return column;
  }

  async delete(id: ColumnId): Promise<void> {
    const pool = getPool();
    await pool.query('DELETE FROM columns WHERE id = ?', [id]);
  }

  async reorderPositions(boardId: BoardId, deletedPosition: number): Promise<void> {
    const pool = getPool();
    await pool.query(
      'UPDATE columns SET position = position - 1 WHERE board_id = ? AND position > ?',
      [boardId, deletedPosition]
    );
  }
}