import { Column, ColumnId } from '../entities/Column';
import { BoardId } from '../entities/Board';

export interface ColumnRepository {
  findAll(): Promise<Column[]>;
  findById(id: ColumnId): Promise<Column | null>;
  findByBoardId(boardId: BoardId): Promise<Column[]>;
  save(column: Column): Promise<Column>;
  update(column: Column): Promise<Column>;
  delete(id: ColumnId): Promise<void>;
  reorderPositions(boardId: BoardId, deletedPosition: number): Promise<void>;
}