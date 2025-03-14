import { Board } from '../../domain/entities/Board';
import { Column } from '../../domain/entities/Column';
import { BoardRepository } from '../../domain/repositories/BoardRepository';
import { ColumnRepository } from '../../domain/repositories/ColumnRepository';
import { BoardDTO, CreateBoardDTO, UpdateBoardDTO } from '../dtos/board.dto';

export class BoardUseCase {
  constructor(
    private boardRepository: BoardRepository,
    private columnRepository: ColumnRepository
  ) {}

  async getAllBoards(): Promise<BoardDTO[]> {
    const boards = await this.boardRepository.findAll();
    return boards.map(board => board.toJSON() as BoardDTO);
  }

  async getBoardWithColumns(id: number): Promise<BoardDTO | null> {
    const board = await this.boardRepository.findById(id);
    if (!board) return null;

    const columns = await this.columnRepository.findByBoardId(id);
    
    // For each column, add its cards
    const boardWithColumns = new Board({
      id: board.id,
      name: board.name,
      createdAt: board.createdAt,
      columns
    });

    return boardWithColumns.toJSON() as BoardDTO;
  }

  async createBoard(data: CreateBoardDTO): Promise<BoardDTO> {
    if (!data.name.trim()) {
      throw new Error('Board name is required');
    }

    const board = new Board({
      name: data.name
    });

    const savedBoard = await this.boardRepository.save(board);

    // Create default columns for the new board
    const defaultColumns = [
      { name: 'To Do', position: 0 },
      { name: 'In Progress', position: 1 },
      { name: 'Done', position: 2 }
    ];

    for (const columnData of defaultColumns) {
      const column = new Column({
        boardId: savedBoard.id!,
        name: columnData.name,
        position: columnData.position
      });

      await this.columnRepository.save(column);
    }

    // Get the board with columns
    return this.getBoardWithColumns(savedBoard.id!) as Promise<BoardDTO>;
  }

  async updateBoard(id: number, data: UpdateBoardDTO): Promise<BoardDTO | null> {
    const board = await this.boardRepository.findById(id);
    if (!board) return null;

    if (data.name) {
      board.rename(data.name);
    }

    const updatedBoard = await this.boardRepository.update(board);
    return updatedBoard.toJSON() as BoardDTO;
  }

  async deleteBoard(id: number): Promise<boolean> {
    const board = await this.boardRepository.findById(id);
    if (!board) return false;

    await this.boardRepository.delete(id);
    return true;
  }
}