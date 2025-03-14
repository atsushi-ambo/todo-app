import { CardDTO } from './card.dto';

export interface ColumnDTO {
  id?: number;
  boardId: number;
  name: string;
  position: number;
  createdAt?: Date;
  cards?: CardDTO[];
}

export interface CreateColumnDTO {
  boardId: number;
  name: string;
}

export interface UpdateColumnDTO {
  name: string;
  position?: number;
}