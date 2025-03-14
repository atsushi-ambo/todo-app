import { BoardId } from './Board';
import { Card } from './Card';

export type ColumnId = number;

export class Column {
  private readonly _id?: ColumnId;
  private readonly _boardId: BoardId;
  private _name: string;
  private _position: number;
  private readonly _createdAt?: Date;
  private _cards: Card[];

  constructor(props: {
    id?: ColumnId;
    boardId: BoardId;
    name: string;
    position: number;
    createdAt?: Date;
    cards?: Card[];
  }) {
    this._id = props.id;
    this._boardId = props.boardId;
    this._name = props.name;
    this._position = props.position;
    this._createdAt = props.createdAt;
    this._cards = props.cards || [];
  }

  // Getters
  get id(): ColumnId | undefined {
    return this._id;
  }

  get boardId(): BoardId {
    return this._boardId;
  }

  get name(): string {
    return this._name;
  }

  get position(): number {
    return this._position;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }
  
  get cards(): Card[] {
    return [...this._cards]; // Return a copy to prevent direct mutation
  }

  // Behaviors
  rename(newName: string): void {
    if (!newName.trim()) {
      throw new Error('Column name cannot be empty');
    }
    this._name = newName;
  }
  
  changePosition(newPosition: number): void {
    if (newPosition < 0) {
      throw new Error('Position cannot be negative');
    }
    this._position = newPosition;
  }
  
  addCard(card: Card): void {
    this._cards.push(card);
    // Sort cards by position
    this._cards.sort((a, b) => a.position - b.position);
  }
  
  removeCard(cardId: number): void {
    this._cards = this._cards.filter(card => card.id !== cardId);
  }

  toJSON() {
    return {
      id: this._id,
      boardId: this._boardId,
      name: this._name,
      position: this._position,
      createdAt: this._createdAt,
      cards: this._cards.map(card => card.toJSON())
    };
  }
}