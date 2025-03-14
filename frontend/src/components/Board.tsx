import React, { useState } from 'react';
import styled from 'styled-components';
import CardList from './CardList';
import { Card } from '../types';

interface CardType {
  id: number;
  title: string;
}

interface ListType {
  id: string;
  title: string;
  cards: CardType[];
}

interface ListsState {
  [key: string]: ListType;
}

const BoardContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow-x: auto;
  height: 100%;
`;

// Example initial data
const initialLists: ListsState = {
  'list-1': {
    id: 'list-1',
    title: 'To Do',
    cards: [
      { id: 1, title: 'Task 1' },
      { id: 2, title: 'Task 2' },
      { id: 3, title: 'Task 3' },
    ],
  },
  'list-2': {
    id: 'list-2',
    title: 'In Progress',
    cards: [
      { id: 4, title: 'Task 4' },
      { id: 5, title: 'Task 5' },
    ],
  },
};

const Board: React.FC = () => {
  const [lists, setLists] = useState<ListsState>(initialLists);

  const handleUpdateCard = (listId: string, cardId: number, title: string) => {
    setLists((prev) => {
      const newList = {...prev};
      const cardIndex = newList[listId].cards.findIndex((card: CardType) => card.id === cardId);
      
      if (cardIndex !== -1) {
        newList[listId].cards[cardIndex] = {
          ...newList[listId].cards[cardIndex],
          title
        };
      }
      
      return newList;
    });
  };

  const handleDeleteCard = (listId: string, cardId: number) => {
    setLists((prev) => {
      const newList = {...prev};
      newList[listId].cards = newList[listId].cards.filter(
        (card: CardType) => card.id !== cardId
      );
      return newList;
    });
  };

  const handleReorderCards = (listId: string, sourceIndex: number, destIndex: number) => {
    setLists((prev) => {
      const newList = {...prev};
      const [removed] = newList[listId].cards.splice(sourceIndex, 1);
      newList[listId].cards.splice(destIndex, 0, removed);
      return newList;
    });
  };

  return (
    <BoardContainer>
      {Object.values(lists).map((list) => (
        <CardList
          key={list.id}
          listId={list.id}
          cards={list.cards as Card[]}
          onUpdateCard={(cardId, title) => handleUpdateCard(list.id, cardId, title)}
          onDeleteCard={(cardId) => handleDeleteCard(list.id, cardId)}
          onReorderCards={(sourceIndex, destIndex) => 
            handleReorderCards(list.id, sourceIndex, destIndex)
          }
        />
      ))}
    </BoardContainer>
  );
};

export default Board;
