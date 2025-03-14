import { Column } from './Column';

export type BoardId = number;

export class Board {
  private readonly _id?: BoardId;
  private _name: string;
  private readonly _createdAt?: Date;
  private _columns: Column[];

  constructor(props: {
    id?: BoardId;
    name: string;
    createdAt?: Date;
    columns?: Column[];
  }) {
    this._id = props.id;
    this._name = props.name;
    this._createdAt = props.createdAt;
    this._columns = props.columns || [];
  }

  // Getters
  get id(): BoardId | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }
  
  get columns(): Column[] {
    return [...this._columns]; // Return a copy to prevent direct mutation
  }

  // Behaviors
  rename(newName: string): void {
    if (!newName.trim()) {
      throw new Error('Board name cannot be empty');
    }
    this._name = newName;
  }
  
  addColumn(column: Column): void {
    this._columns.push(column);
  }
  
  removeColumn(columnId: number): void {
    this._columns = this._columns.filter(column => column.id !== columnId);
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      createdAt: this._createdAt,
      columns: this._columns.map(column => column.toJSON())
    };
  }
}