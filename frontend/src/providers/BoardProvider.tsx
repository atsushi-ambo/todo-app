import React, { createContext, useContext, useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Board } from '../types/Board';

interface BoardContextType {
  boards: Board[];
  loading: boolean;
  error: Error | null;
  fetchBoards: () => Promise<void>;
  updateBoard: (board: Board) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
};

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [boards, setBoards] = useState<Board[]>([
    // Provide initial data with clearer properties
    {
      id: '1',
      title: 'To Do',
      items: [
        { id: '101', content: 'Create user registration' },
        { id: '102', content: 'Design database schema' }
      ]
    },
    {
      id: '2',
      title: 'In Progress',
      items: [
        { id: '103', content: 'Set up CI/CD pipeline' }
      ]
    },
    {
      id: '3',
      title: 'Done',
      items: [
        { id: '104', content: 'Project setup' },
        { id: '105', content: 'Create repository' }
      ]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBoards = async () => {
    // Mock implementation - replace with actual API call
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Keep using the initial data for now
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch boards'));
    } finally {
      setLoading(false);
    }
  };

  const updateBoard = async (board: Board) => {
    try {
      // Mock implementation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setBoards(boards.map(b => b.id === board.id ? board : b));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update board'));
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    // Log the boards data on mount and whenever it changes
    console.log('Boards data:', boards);
  }, [boards]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // If no destination or same position, do nothing
    if (!destination) {
      return;
    }

    // Make a deep copy of the boards to work with
    const updatedBoards = JSON.parse(JSON.stringify(boards));
    
    // Find the source and destination boards
    const sourceBoard = updatedBoards.find((b: Board) => b.id.toString() === source.droppableId);
    const destBoard = updatedBoards.find((b: Board) => b.id.toString() === destination.droppableId);
    
    if (!sourceBoard || !destBoard) {
      console.error('Could not find source or destination board', { 
        source: source.droppableId, 
        destination: destination.droppableId, 
        boards: updatedBoards.map((b: Board) => b.id.toString()) 
      });
      return;
    }

    // Get the item being moved
    const [movedItem] = sourceBoard.items.splice(source.index, 1);
    
    // Insert the item at the new position
    destBoard.items.splice(destination.index, 0, movedItem);
    
    // Update state
    setBoards(updatedBoards);
  };

  return (
    <BoardContext.Provider value={{ boards, loading, error, fetchBoards, updateBoard }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        {children}
      </DragDropContext>
    </BoardContext.Provider>
  );
};

// Ensure this is treated as a module
export {}
