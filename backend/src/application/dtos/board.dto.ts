import { CardDTO } from './card.dto';
import { ColumnDTO } from './column.dto';

export interface BoardDTO {
  id?: number;
  name: string;
  createdAt?: Date;
  columns?: ColumnDTO[];
}

export interface CreateBoardDTO {
  name: string;
}

export interface UpdateBoardDTO {
  name: string;
}