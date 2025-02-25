import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Card } from '../types';

interface CardItemProps {
  card: {
    id: number | string;
    title: string;
  };
  index: number;
  onUpdateCard: (title: string) => void;
  onDeleteCard: () => void;
}

const CardContainer = styled.div<{ isDragging: boolean }>`
  background-color: ${props => (props.isDragging ? '#f7f8f9' : 'white')};
  border-radius: 6px;
  box-shadow: ${props => props.isDragging 
    ? '0 8px 16px rgba(9, 30, 66, 0.25)' 
    : '0 1px 2px rgba(9, 30, 66, 0.15)'};
  margin-bottom: 8px;
  min-height: 32px;
  padding: 8px 12px;
  position: relative;
  transition: background-color 0.2s ease;
  cursor: grab;

  &:hover {
    background-color: #f7f8f9;
    box-shadow: 0 2px 4px rgba(9, 30, 66, 0.2);
  }

  &:active {
    cursor: grabbing;
  }
`;

const CardTitle = styled.div`
  color: #172b4d;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
`;

const CardActions = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const Button = styled.button`
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--gmo-blue-light);
  }
`;

const EditButton = styled(Button)`
  background-color: transparent;
  color: #42526e;

  &:hover {
    background-color: rgba(9, 30, 66, 0.08);
    color: var(--gmo-blue);
  }
`;

const DeleteButton = styled(Button)`
  background-color: transparent;
  color: #42526e;

  &:hover {
    background-color: #ffebe6;
    color: #de350b;
  }
`;

const EditForm = styled.div`
  margin: -8px -12px;
  padding: 8px 12px;
  background-color: #fff;
  border-radius: 6px;
`;

const EditInput = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid var(--gmo-blue);
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
  min-height: 80px;
  margin-bottom: 8px;
  resize: vertical;
  background: white;

  &:focus {
    outline: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const SaveButton = styled(Button)`
  background-color: var(--gmo-blue);
  color: white;

  &:hover {
    background-color: var(--gmo-blue-light);
  }

  &::before {
    content: "✓";
    font-size: 11px;
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  color: #42526e;

  &:hover {
    background-color: rgba(9, 30, 66, 0.08);
  }

  &::before {
    content: "×";
    font-size: 14px;
  }
`;

const CardItem: React.FC<CardItemProps> = ({ 
  card, 
  index, 
  onUpdateCard, 
  onDeleteCard
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdateCard(editTitle.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(card.title);
    }
  };

  return (
    <Draggable draggableId={String(card.id)} index={index}>
      {(provided, snapshot) => (
        <CardContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
          style={provided.draggableProps.style}
        >
          {isEditing ? (
            <EditForm>
              <EditInput
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder="Enter card title..."
              />
              <ButtonContainer>
                <SaveButton onClick={handleSave}>Save</SaveButton>
                <CancelButton 
                  onClick={() => {
                    setIsEditing(false);
                    setEditTitle(card.title);
                  }}
                >
                  Cancel
                </CancelButton>
              </ButtonContainer>
            </EditForm>
          ) : (
            <>
              <CardTitle>{card.title}</CardTitle>
              <CardActions>
                <EditButton onClick={() => setIsEditing(true)}>Edit</EditButton>
                <DeleteButton onClick={onDeleteCard}>Delete</DeleteButton>
              </CardActions>
            </>
          )}
        </CardContainer>
      )}
    </Draggable>
  );
};

export default CardItem;