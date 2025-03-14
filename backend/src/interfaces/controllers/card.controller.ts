import { Request, Response } from 'express';
import { CardUseCase } from '../../application/useCases/CardUseCase';
import { CreateCardDTO, UpdateCardDTO, MoveCardDTO } from '../../application/dtos/card.dto';

export class CardController {
  constructor(private cardUseCase: CardUseCase) {}

  getCards = async (req: Request, res: Response) => {
    try {
      const cards = await this.cardUseCase.getAllCards();
      res.json(cards);
    } catch (error) {
      console.error('Error fetching cards:', error);
      res.status(500).json({ error: 'Failed to fetch cards' });
    }
  };

  getCardsByColumnId = async (req: Request, res: Response) => {
    try {
      const { columnId } = req.params;
      const cards = await this.cardUseCase.getCardsByColumnId(Number(columnId));
      res.json(cards);
    } catch (error) {
      console.error('Error fetching cards by column ID:', error);
      res.status(500).json({ error: 'Failed to fetch cards' });
    }
  };

  getCard = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const card = await this.cardUseCase.getCard(Number(id));
      
      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }
      
      res.json(card);
    } catch (error) {
      console.error('Error fetching card:', error);
      res.status(500).json({ error: 'Failed to fetch card' });
    }
  };

  createCard = async (req: Request, res: Response) => {
    try {
      const { column_id, title, description } = req.body;
      
      if (!column_id || !title) {
        return res.status(400).json({ error: 'Column ID and title are required' });
      }
      
      const cardData: CreateCardDTO = { 
        columnId: Number(column_id),
        title,
        description
      };
      
      const card = await this.cardUseCase.createCard(cardData);
      res.status(201).json({ ...card, message: 'Card created successfully' });
    } catch (error) {
      console.error('Error creating card:', error);
      res.status(500).json({ error: 'Failed to create card' });
    }
  };

  updateCard = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description, position } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: 'Card title is required' });
      }
      
      const cardData: UpdateCardDTO = { 
        title,
        description,
      };
      
      if (position !== undefined) {
        cardData.position = Number(position);
      }
      
      const card = await this.cardUseCase.updateCard(Number(id), cardData);
      
      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }
      
      res.json({ ...card, message: 'Card updated successfully' });
    } catch (error) {
      console.error('Error updating card:', error);
      res.status(500).json({ error: 'Failed to update card' });
    }
  };

  moveCard = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { column_id, position, source_column_id } = req.body;
      
      if (column_id === undefined || position === undefined || source_column_id === undefined) {
        return res.status(400).json({ error: 'Column ID, source column ID, and position are required' });
      }
      
      const moveData: MoveCardDTO = {
        sourceColumnId: Number(source_column_id),
        destinationColumnId: Number(column_id),
        position: Number(position)
      };
      
      const card = await this.cardUseCase.moveCard(Number(id), moveData);
      
      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }
      
      res.json({ ...card, message: 'Card moved successfully' });
    } catch (error) {
      console.error('Error moving card:', error);
      res.status(500).json({ error: 'Failed to move card' });
    }
  };

  deleteCard = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.cardUseCase.deleteCard(Number(id));
      
      if (!success) {
        return res.status(404).json({ error: 'Card not found' });
      }
      
      res.json({ message: 'Card deleted successfully' });
    } catch (error) {
      console.error('Error deleting card:', error);
      res.status(500).json({ error: 'Failed to delete card' });
    }
  };
}