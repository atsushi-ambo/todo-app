export interface CardDTO {
  id?: number;
  columnId: number;
  title: string;
  description?: string;
  position: number;
  createdAt?: Date;
}

export interface CreateCardDTO {
  columnId: number;
  title: string;
  description?: string;
}

export interface UpdateCardDTO {
  title?: string;
  description?: string;
  position?: number;
}

export interface MoveCardDTO {
  sourceColumnId: number;
  destinationColumnId: number;
  position: number;
}