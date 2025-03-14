import { Card, CardId } from '../entities/Card';
import { ColumnId } from '../entities/Column';

export interface MoveCardParams {
  cardId: CardId;
  sourceColumnId: ColumnId; 
  destinationColumnId: ColumnId;
  position: number;
}

export interface CardRepository {
  findAll(): Promise<Card[]>;
  findById(id: CardId): Promise<Card | null>;
  findByColumnId(columnId: ColumnId): Promise<Card[]>;
  save(card: Card): Promise<Card>;
  update(card: Card): Promise<Card>;
  delete(id: CardId): Promise<void>;
  moveCard(params: MoveCardParams): Promise<Card>;
  reorderPositions(columnId: ColumnId, deletedPosition: number): Promise<void>;
}