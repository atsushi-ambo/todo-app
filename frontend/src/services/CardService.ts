import axios from 'axios';
import { Card } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

interface CardCreate {
  column_id: number;
  title: string;
  description?: string;
}

interface CardUpdate {
  title?: string;
  description?: string;
  position?: number;
}

interface CardMove {
  column_id: number;
  position: number;
  source_column_id: number;
}

class CardService {
  getCards = async (): Promise<Card[]> => {
    const response = await axios.get(`${API_URL}/cards`);
    return response.data;
  };

  getCardsByColumn = async (columnId: number): Promise<Card[]> => {
    const response = await axios.get(`${API_URL}/cards/column/${columnId}`);
    return response.data;
  };

  getCard = async (id: number): Promise<Card> => {
    const response = await axios.get(`${API_URL}/cards/${id}`);
    return response.data;
  };

  createCard = async (cardData: CardCreate): Promise<Card> => {
    const response = await axios.post(`${API_URL}/cards`, cardData);
    return response.data;
  };

  updateCard = async (id: number, cardData: CardUpdate): Promise<Card> => {
    const response = await axios.put(`${API_URL}/cards/${id}`, cardData);
    return response.data;
  };

  moveCard = async (id: number, moveData: CardMove): Promise<Card> => {
    const response = await axios.put(`${API_URL}/cards/${id}/move`, {
      column_id: moveData.column_id,
      position: moveData.position,
      source_column_id: moveData.source_column_id
    });
    return response.data;
  };

  deleteCard = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/cards/${id}`);
  };
}

export default new CardService();