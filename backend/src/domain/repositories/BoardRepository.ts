import { Board, BoardId } from '../entities/Board';

export interface BoardRepository {
  findAll(): Promise<Board[]>;
  findById(id: BoardId): Promise<Board | null>;
  save(board: Board): Promise<Board>;
  update(board: Board): Promise<Board>;
  delete(id: BoardId): Promise<void>;
}