import { Board, BoardId } from '../../domain/entities/Board';
import { BoardRepository } from '../../domain/repositories/BoardRepository';
import { getPool, RowDataPacket, ResultSetHeader } from '../db/mysql';

export class MysqlBoardRepository implements BoardRepository {
  async findAll(): Promise<Board[]> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM boards ORDER BY created_at DESC'
    );

    return rows.map(row => new Board({
      id: row.id,
      name: row.name,
      createdAt: row.created_at
    }));
  }

  async findById(id: BoardId): Promise<Board | null> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM boards WHERE id = ?', 
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return new Board({
      id: row.id,
      name: row.name,
      createdAt: row.created_at
    });
  }

  async save(board: Board): Promise<Board> {
    const pool = getPool();
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO boards (name) VALUES (?)',
      [board.name]
    );

    // Return a new Board instance with the generated ID
    return new Board({
      id: result.insertId,
      name: board.name,
      createdAt: new Date()
    });
  }

  async update(board: Board): Promise<Board> {
    if (!board.id) {
      throw new Error('Cannot update a board without an ID');
    }

    const pool = getPool();
    await pool.query(
      'UPDATE boards SET name = ? WHERE id = ?',
      [board.name, board.id]
    );

    // Return the updated board
    return board;
  }

  async delete(id: BoardId): Promise<void> {
    const pool = getPool();
    await pool.query('DELETE FROM boards WHERE id = ?', [id]);
  }
}