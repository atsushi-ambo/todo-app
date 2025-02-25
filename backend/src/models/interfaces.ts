export interface Board {
  id?: number;
  name: string;
  created_at?: Date;
}

export interface Column {
  id?: number;
  board_id: number;
  name: string;
  position: number;
  created_at?: Date;
}

export interface Card {
  id?: number;
  column_id: number;
  title: string;
  description?: string;
  position: number;
  created_at?: Date;
}