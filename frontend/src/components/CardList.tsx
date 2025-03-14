import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import CardItem from './CardItem';
import { Card } from '../types';

interface CardListProps {
  cards: Card[];
  listId: string;
  onUpdateCard: (cardId: number, title: string) => void;
  onDeleteCard: (cardId: number) => void;
  onReorderCards: (sourceIndex: number, destinationIndex: number) => void;
}

const ListContainer = styled.div`
  background-color: #f4f5f7;
  border-radius: 8px;
  padding: 8px;
  width: 100%;
  max-width: 300px;
`;

const CardsContainer = styled.div`
  min-height: 20px;
`;

const CardList: React.FC<CardListProps> = ({ 
  cards,
  listId,
  onUpdateCard,
  onDeleteCard,
  onReorderCards
}) => {
  return (
    <ListContainer>
      <Droppable droppableId={listId}>
        {(provided) => (
          <CardsContainer
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cards.map((card, index) => (
              <CardItem
                key={card.id}
                card={card}
                index={index}
                onUpdateCard={(title) => onUpdateCard(card.id, title)}
                onDeleteCard={() => onDeleteCard(card.id)}
              />
            ))}
            {provided.placeholder}
          </CardsContainer>
        )}
      </Droppable>
    </ListContainer>
  );
};

export default CardList;
