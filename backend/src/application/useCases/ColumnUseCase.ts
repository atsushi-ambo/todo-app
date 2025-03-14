import { Column } from '../../domain/entities/Column';
import { ColumnRepository } from '../../domain/repositories/ColumnRepository';
import { CardRepository } from '../../domain/repositories/CardRepository';
import { ColumnDTO, CreateColumnDTO, UpdateColumnDTO } from '../dtos/column.dto';

export class ColumnUseCase {
  constructor(
    private columnRepository: ColumnRepository,
    private cardRepository: CardRepository
  ) {}

  async getAllColumns(): Promise<ColumnDTO[]> {
    const columns = await this.columnRepository.findAll();
    return columns.map(column => column.toJSON() as ColumnDTO);
  }

  async getColumnsByBoardId(boardId: number): Promise<ColumnDTO[]> {
    const columns = await this.columnRepository.findByBoardId(boardId);
    
    // For each column, get its cards
    const columnsWithCards = columns.map(column => {
      return column.toJSON() as ColumnDTO;
    });
    
    return columnsWithCards;
  }

  async getColumnWithCards(id: number): Promise<ColumnDTO | null> {
    const column = await this.columnRepository.findById(id);
    if (!column) return null;

    const cards = await this.cardRepository.findByColumnId(id);
    
    // Create a new column with the cards
    const columnWithCards = new Column({
      id: column.id,
      boardId: column.boardId,
      name: column.name,
      position: column.position,
      createdAt: column.createdAt,
      cards
    });

    return columnWithCards.toJSON() as ColumnDTO;
  }

  async createColumn(data: CreateColumnDTO): Promise<ColumnDTO> {
    if (!data.name.trim()) {
      throw new Error('Column name is required');
    }

    // Get the highest position value for the board
    const columns = await this.columnRepository.findByBoardId(data.boardId);
    const maxPosition = columns.length > 0 
      ? Math.max(...columns.map(col => col.position)) 
      : -1;
    const newPosition = maxPosition + 1;

    const column = new Column({
      boardId: data.boardId,
      name: data.name,
      position: newPosition
    });

    const savedColumn = await this.columnRepository.save(column);
    return savedColumn.toJSON() as ColumnDTO;
  }

  async updateColumn(id: number, data: UpdateColumnDTO): Promise<ColumnDTO | null> {
    const column = await this.columnRepository.findById(id);
    if (!column) return null;

    if (data.name) {
      column.rename(data.name);
    }
    
    if (data.position !== undefined) {
      column.changePosition(data.position);
    }

    const updatedColumn = await this.columnRepository.update(column);
    return updatedColumn.toJSON() as ColumnDTO;
  }

  async deleteColumn(id: number): Promise<boolean> {
    const column = await this.columnRepository.findById(id);
    if (!column) return false;

    // Store the position and board ID before deleting
    const position = column.position;
    const boardId = column.boardId;

    await this.columnRepository.delete(id);
    
    // Reorder positions of remaining columns in the same board
    await this.columnRepository.reorderPositions(boardId, position);
    
    return true;
  }
}