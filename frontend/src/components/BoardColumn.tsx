import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import CardItem from './CardItem';
import { Column, Card } from '../types';

interface BoardColumnProps {
  column: Column;
  onAddCard: (columnId: number, title: string) => void;
  onUpdateCard: (cardId: number, columnId: number, title: string) => void;
  onDeleteCard: (cardId: number, columnId: number) => void;
}

const ColumnContainer = styled.div`
  background-color: #f4f5f7;
  border-radius: 10px;
  min-width: 280px;
  max-width: 280px;
  margin-right: 16px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 120px);
`;

const ColumnHeader = styled.div`
  padding: 12px;
  font-weight: 600;
  color: #172b4d;
  border-bottom: 1px solid #dfe1e6;
  position: sticky;
  top: 0;
  background: #f4f5f7;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  z-index: 1;
`;

const CardsContainer = styled.div<{ isDraggingOver: boolean }>`
  padding: 8px;
  flex-grow: 1;
  overflow-y: auto;
  background-color: ${props => props.isDraggingOver ? '#E6FCFF' : '#f4f5f7'};
  transition: background-color 0.2s ease;
  min-height: 100px;

  /* Custom scrollbar for cards container */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #dfe1e6;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #c1c7d0;
  }
`;

const AddCardButton = styled.button`
  padding: 8px 12px;
  margin: 8px;
  background-color: transparent;
  color: #5e6c84;
  text-align: left;
  border-radius: 3px;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;

  &:hover {
    background-color: rgba(9, 30, 66, 0.08);
    color: #172b4d;
  }

  &::before {
    content: "+";
    margin-right: 6px;
    font-size: 14px;
    font-weight: bold;
  }
`;

const AddCardForm = styled.div`
  padding: 0 8px 8px 8px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const CardInput = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid var(--gmo-blue);
  border-radius: 4px;
  resize: none;
  font-size: 14px;
  line-height: 20px;
  font-family: inherit;
  min-height: 80px;
  margin-bottom: 8px;

  &:focus {
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AddButton = styled.button`
  background-color: var(--gmo-blue);
  color: white;
  padding: 6px 12px;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: var(--gmo-blue-light);
  }

  &:disabled {
    background-color: #dfe1e6;
    color: #a5adba;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: #42526e;
  padding: 6px;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(9, 30, 66, 0.08);
  }
`;

const BoardColumn: React.FC<BoardColumnProps> = ({ 
  column, 
  onAddCard, 
  onUpdateCard, 
  onDeleteCard 
}) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(column.id, newCardTitle.trim());
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAddCard();
    } else if (e.key === 'Escape') {
      setIsAddingCard(false);
      setNewCardTitle('');
    }
  };

  return (
    <ColumnContainer>
      <ColumnHeader>{column.name}</ColumnHeader>
      <Droppable droppableId={column.id.toString()}>
        {(provided, snapshot) => (
          <CardsContainer
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {column.cards.map((card: Card, index: number) => (
              <CardItem
                key={card.id}
                card={card}
                index={index}
                onUpdateCard={(title) => onUpdateCard(card.id, column.id, title)}
                onDeleteCard={() => onDeleteCard(card.id, column.id)}
              />
            ))}
            {provided.placeholder}
          </CardsContainer>
        )}
      </Droppable>

      {isAddingCard ? (
        <AddCardForm>
          <CardInput
            placeholder="Enter a title for this card..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <ButtonGroup>
            <AddButton 
              onClick={handleAddCard}
              disabled={!newCardTitle.trim()}
            >
              Add card
            </AddButton>
            <CancelButton 
              onClick={() => {
                setIsAddingCard(false);
                setNewCardTitle('');
              }}
            >
              ×
            </CancelButton>
          </ButtonGroup>
        </AddCardForm>
      ) : (
        <AddCardButton onClick={() => setIsAddingCard(true)}>
          Add a card
        </AddCardButton>
      )}
    </ColumnContainer>
  );
};

export default BoardColumn;