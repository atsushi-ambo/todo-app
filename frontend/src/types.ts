export interface Board {
  id: number;
  name: string;
  created_at?: string;
  columns: Column[];
}

export interface Column {
  id: number;
  board_id: number;
  name: string;
  position: number;
  created_at?: string;
  cards: Card[];
}

export interface Card {
  id: number;
  title: string;
  column_id?: number; // Changed from string to number since column IDs are numbers
  position?: number;
  description?: string;
  created_at?: string;
}

// Add any other types your application needs here