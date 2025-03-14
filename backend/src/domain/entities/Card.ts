import { ColumnId } from './Column';

export type CardId = number;

export class Card {
  private readonly _id?: CardId;
  private readonly _columnId: ColumnId;
  private _title: string;
  private _description: string;
  private _position: number;
  private readonly _createdAt?: Date;

  constructor(props: {
    id?: CardId;
    columnId: ColumnId;
    title: string;
    description?: string;
    position: number;
    createdAt?: Date;
  }) {
    this._id = props.id;
    this._columnId = props.columnId;
    this._title = props.title;
    this._description = props.description || '';
    this._position = props.position;
    this._createdAt = props.createdAt;
  }

  // Getters
  get id(): CardId | undefined {
    return this._id;
  }

  get columnId(): ColumnId {
    return this._columnId;
  }

  get title(): string {
    return this._title;
  }
  
  get description(): string {
    return this._description;
  }
  
  get position(): number {
    return this._position;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  // Behaviors
  updateTitle(newTitle: string): void {
    if (!newTitle.trim()) {
      throw new Error('Card title cannot be empty');
    }
    this._title = newTitle;
  }
  
  updateDescription(newDescription: string): void {
    this._description = newDescription;
  }
  
  changePosition(newPosition: number): void {
    if (newPosition < 0) {
      throw new Error('Position cannot be negative');
    }
    this._position = newPosition;
  }

  toJSON() {
    return {
      id: this._id,
      columnId: this._columnId,
      title: this._title,
      description: this._description,
      position: this._position,
      createdAt: this._createdAt
    };
  }
}