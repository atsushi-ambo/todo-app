import axios from 'axios';
import { Board } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

class BoardService {
  getBoards = async (): Promise<Board[]> => {
    const response = await axios.get(`${API_URL}/boards`);
    return response.data;
  };

  getBoard = async (id: number): Promise<Board> => {
    const response = await axios.get(`${API_URL}/boards/${id}`);
    return response.data;
  };

  createBoard = async (name: string): Promise<Board> => {
    const response = await axios.post(`${API_URL}/boards`, { name });
    return response.data;
  };

  updateBoard = async (id: number, name: string): Promise<Board> => {
    const response = await axios.put(`${API_URL}/boards/${id}`, { name });
    return response.data;
  };

  deleteBoard = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/boards/${id}`);
  };
}

export default new BoardService();