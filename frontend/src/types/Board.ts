export type BoardId = number | string;

export interface BoardItem {
  id: number | string;
  content: string;
}

export interface Board {
  id: BoardId;
  title: string;
  items: BoardItem[];
}

// Ensure this is treated as a module
export {}
