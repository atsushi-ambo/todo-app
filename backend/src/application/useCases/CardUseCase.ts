import { Card } from '../../domain/entities/Card';
import { CardRepository, MoveCardParams } from '../../domain/repositories/CardRepository';
import { CardDTO, CreateCardDTO, UpdateCardDTO, MoveCardDTO } from '../dtos/card.dto';

export class CardUseCase {
  constructor(private cardRepository: CardRepository) {}

  async getAllCards(): Promise<CardDTO[]> {
    const cards = await this.cardRepository.findAll();
    return cards.map(card => card.toJSON() as CardDTO);
  }

  async getCardsByColumnId(columnId: number): Promise<CardDTO[]> {
    const cards = await this.cardRepository.findByColumnId(columnId);
    return cards.map(card => card.toJSON() as CardDTO);
  }

  async getCard(id: number): Promise<CardDTO | null> {
    const card = await this.cardRepository.findById(id);
    if (!card) return null;

    return card.toJSON() as CardDTO;
  }

  async createCard(data: CreateCardDTO): Promise<CardDTO> {
    if (!data.title.trim()) {
      throw new Error('Card title is required');
    }

    // Get the highest position value for the column
    const cards = await this.cardRepository.findByColumnId(data.columnId);
    const maxPosition = cards.length > 0 
      ? Math.max(...cards.map(card => card.position)) 
      : -1;
    const newPosition = maxPosition + 1;

    const card = new Card({
      columnId: data.columnId,
      title: data.title,
      description: data.description || '',
      position: newPosition
    });

    const savedCard = await this.cardRepository.save(card);
    return savedCard.toJSON() as CardDTO;
  }

  async updateCard(id: number, data: UpdateCardDTO): Promise<CardDTO | null> {
    const card = await this.cardRepository.findById(id);
    if (!card) return null;

    if (data.title) {
      card.updateTitle(data.title);
    }

    if (data.description !== undefined) {
      card.updateDescription(data.description);
    }

    if (data.position !== undefined) {
      card.changePosition(data.position);
    }

    const updatedCard = await this.cardRepository.update(card);
    return updatedCard.toJSON() as CardDTO;
  }

  async moveCard(id: number, data: MoveCardDTO): Promise<CardDTO | null> {
    const card = await this.cardRepository.findById(id);
    if (!card) return null;

    const params: MoveCardParams = {
      cardId: id,
      sourceColumnId: data.sourceColumnId,
      destinationColumnId: data.destinationColumnId,
      position: data.position
    };

    const movedCard = await this.cardRepository.moveCard(params);
    return movedCard.toJSON() as CardDTO;
  }

  async deleteCard(id: number): Promise<boolean> {
    const card = await this.cardRepository.findById(id);
    if (!card) return false;

    // Store column ID and position before deleting
    const columnId = card.columnId;
    const position = card.position;

    await this.cardRepository.delete(id);
    
    // Reorder positions of remaining cards in the same column
    await this.cardRepository.reorderPositions(columnId, position);
    
    return true;
  }
}