import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import BoardService from './services/BoardService';
import CardService from './services/CardService';
import Header from './components/Header';
import BoardColumn from './components/BoardColumn';
import { Board, Column, Card } from './types';

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: var(--gmo-blue);
  display: flex;
  flex-direction: column;
`;

const BoardContainer = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 20px;
  margin-top: 10px;
  overflow-x: auto;
  align-items: flex-start;
  scrollbar-width: thin;
  
  &::-webkit-scrollbar {
    height: 12px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 6px;
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
  font-size: 1.2em;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
  background: rgba(255, 0, 0, 0.1);
  text-align: center;
  padding: 20px;
`;

const App: React.FC = () => {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true);
        // Fetch the first board (You can modify this logic to fetch specific boards)
        const boards = await BoardService.getBoards();
        if (boards.length > 0) {
          const boardData = await BoardService.getBoard(boards[0].id);
          setBoard(boardData);
        } else {
          setError('No boards found');
        }
      } catch (err) {
        // Use error message from backend if provided
        const errorObj = err as any;
        const message = errorObj.response?.data?.error || 'Error loading board';
        setError(message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    if (!destination || !board) {
      return;
    }
    
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
    
    try {
      const cardId = parseInt(draggableId);
      const sourceColumnId = parseInt(source.droppableId);
      const destinationColumnId = parseInt(destination.droppableId);
      
      // Create a new board object for state update
      const newBoard = { ...board };
      
      // Find the source and destination columns
      const sourceColumn = newBoard.columns.find((col: Column) => col.id === sourceColumnId);
      const destColumn = newBoard.columns.find((col: Column) => col.id === destinationColumnId);
      
      if (!sourceColumn || !destColumn) {
        return;
      }

      // Remove card from source column
      const [movedCard] = sourceColumn.cards.splice(source.index, 1);
      
      // Add card to destination column
      destColumn.cards.splice(destination.index, 0, movedCard);
      
      // Update state immediately for smooth UI update
      setBoard(newBoard);

      // Call API to persist the change
      await CardService.moveCard(cardId, {
        sourceColumnId,
        destinationColumnId,
        position: destination.index
      });
    } catch (err) {
      console.error('Error moving card:', err);
      // Reload the board to get the correct state in case of error
      const boardData = await BoardService.getBoard(board.id);
      setBoard(boardData);
    }
  };

  const addNewCard = async (columnId: number, title: string) => {
    if (!board) return;
    
    try {
      const newCard = await CardService.createCard({
        column_id: columnId,
        title,
        description: ''
      });
      
      const newBoard = { ...board };
      const columnIndex = newBoard.columns.findIndex((col: Column) => col.id === columnId);
      
      if (columnIndex !== -1) {
        newBoard.columns[columnIndex].cards.push(newCard);
        setBoard(newBoard);
      }
    } catch (err) {
      console.error('Error adding new card:', err);
    }
  };

  const updateCardTitle = async (cardId: number, columnId: number, title: string) => {
    if (!board) return;
    
    try {
      await CardService.updateCard(cardId, { title });
      
      const newBoard = { ...board };
      const columnIndex = newBoard.columns.findIndex((col: Column) => col.id === columnId);
      
      if (columnIndex !== -1) {
        const cardIndex = newBoard.columns[columnIndex].cards.findIndex((card: Card) => card.id === cardId);
        
        if (cardIndex !== -1) {
          newBoard.columns[columnIndex].cards[cardIndex].title = title;
          setBoard(newBoard);
        }
      }
    } catch (err) {
      console.error('Error updating card:', err);
    }
  };

  const deleteCard = async (cardId: number, columnId: number) => {
    if (!board) return;
    
    try {
      await CardService.deleteCard(cardId);
      
      const newBoard = { ...board };
      const columnIndex = newBoard.columns.findIndex((col: Column) => col.id === columnId);
      
      if (columnIndex !== -1) {
        newBoard.columns[columnIndex].cards = newBoard.columns[columnIndex].cards.filter(
          (card: Card) => card.id !== cardId
        );
        setBoard(newBoard);
      }
    } catch (err) {
      console.error('Error deleting card:', err);
    }
  };

  if (loading) {
    return (
      <AppContainer>
        <LoadingContainer>
          <div>Loading your board...</div>
        </LoadingContainer>
      </AppContainer>
    );
  }

  if (error || !board) {
    return (
      <AppContainer>
        <ErrorContainer>
          <div>
            <h2>Oops! Something went wrong</h2>
            <p>{error || 'Unable to load the board'}</p>
          </div>
        </ErrorContainer>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Header boardName={board.name} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <BoardContainer>
          {board.columns.map((column: Column) => (
            <BoardColumn
              key={`column-${column.id}`}
              column={column}
              onAddCard={addNewCard}
              onUpdateCard={updateCardTitle}
              onDeleteCard={deleteCard}
            />
          ))}
        </BoardContainer>
      </DragDropContext>
    </AppContainer>
  );
};

export default App;