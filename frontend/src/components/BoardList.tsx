import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useBoardContext } from '../providers/BoardProvider';

export const BoardList: React.FC = () => {
  const { boards, loading, error } = useBoardContext();

  if (loading) return <div>Loading boards...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  console.log('Rendering boards:', boards); // Add logging to verify data

  return (
    <div className="board-list">
      {boards.map((board) => (
        <div key={board.id} className="board-column">
          <h3>{board.title}</h3>
          <Droppable droppableId={String(board.id)}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`droppable-area ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                data-testid={`droppable-${board.id}`}
              >
                {Array.isArray(board.items) && board.items.length > 0 ? (
                  board.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={String(item.id)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`drag-item ${snapshot.isDragging ? 'dragging' : ''}`}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="empty-message">No items in this board</div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </div>
  );
};

export {}
