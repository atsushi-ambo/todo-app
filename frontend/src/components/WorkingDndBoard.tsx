import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Item {
  id: string;
  content: string;
  priority?: 'low' | 'medium' | 'high';
  labels?: string[];
}

interface Column {
  id: string;
  title: string;
  items: Item[];
}

interface BoardData {
  columns: {
    [key: string]: Column;
  };
  columnOrder: string[];
}

const initialData: BoardData = {
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      items: [
        { id: 'task-1', content: 'Create user registration', priority: 'high', labels: ['feature'] },
        { id: 'task-2', content: 'Design database schema', priority: 'medium', labels: ['design'] }
      ]
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      items: [
        { id: 'task-3', content: 'Set up CI/CD pipeline', priority: 'medium', labels: ['devops'] }
      ]
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      items: [
        { id: 'task-4', content: 'Project setup', priority: 'low', labels: ['setup'] },
        { id: 'task-5', content: 'Create repository', priority: 'low', labels: ['setup'] }
      ]
    }
  },
  columnOrder: ['column-1', 'column-2', 'column-3']
};

const WorkingDndBoard: React.FC = () => {
  const [boardData, setBoardData] = useState<BoardData>(initialData);
  const [title, setTitle] = useState<string>("Board Management App");
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [editingCard, setEditingCard] = useState<{ columnId: string, taskId: string } | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [addingCard, setAddingCard] = useState<string | null>(null);
  const [newCardContent, setNewCardContent] = useState<string>("");

  // Log state changes - for debugging
  useEffect(() => {
    console.log('Board data updated:', boardData);
  }, [boardData]);

  // Function to handle drag end event
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // Log the drag operation for debugging
    console.log('Drag operation:', { source, destination, draggableId });
    
    // If there is no destination (dropped outside a droppable area)
    if (!destination) {
      console.log('No destination - drag canceled');
      return;
    }
    
    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      console.log('Dropped in same position - no action needed');
      return;
    }
    
    // Get the source column
    const startColumn = boardData.columns[source.droppableId];
    // Get the destination column
    const finishColumn = boardData.columns[destination.droppableId];
    
    // If moving within the same column
    if (startColumn === finishColumn) {
      const newItems = Array.from(startColumn.items);
      // Remove the item from the source position
      const [movedItem] = newItems.splice(source.index, 1);
      // Insert the item at the destination position
      newItems.splice(destination.index, 0, movedItem);
      
      // Create the new column with updated items
      const newColumn = {
        ...startColumn,
        items: newItems
      };
      
      // Update the board state
      const newState = {
        ...boardData,
        columns: {
          ...boardData.columns,
          [newColumn.id]: newColumn
        }
      };
      
      setBoardData(newState);
      console.log('Reordered within column:', newColumn.title);
      return;
    }
    
    // Moving from one column to another
    const startItems = Array.from(startColumn.items);
    // Remove from source column
    const [movedItem] = startItems.splice(source.index, 1);
    const newStartColumn = {
      ...startColumn,
      items: startItems
    };
    
    const finishItems = Array.from(finishColumn.items);
    // Add to destination column
    finishItems.splice(destination.index, 0, movedItem);
    const newFinishColumn = {
      ...finishColumn,
      items: finishItems
    };
    
    // Update the state with both columns changed
    const newState = {
      ...boardData,
      columns: {
        ...boardData.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn
      }
    };
    
    setBoardData(newState);
    console.log(`Moved from ${startColumn.title} to ${finishColumn.title}`);
  };

  // Function to delete a card
  const handleDeleteCard = (columnId: string, taskId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      const column = boardData.columns[columnId];
      const updatedItems = column.items.filter(item => item.id !== taskId);
      
      const updatedColumn = {
        ...column,
        items: updatedItems
      };
      
      const newState = {
        ...boardData,
        columns: {
          ...boardData.columns,
          [columnId]: updatedColumn
        }
      };
      
      setBoardData(newState);
      console.log(`Deleted task ${taskId} from ${column.title}`);
    }
  };

  // Function to start editing a card
  const startEditingCard = (columnId: string, taskId: string, content: string) => {
    setEditingCard({ columnId, taskId });
    setEditContent(content);
  };

  // Function to save edits to a card
  const saveCardEdit = () => {
    if (!editingCard) return;
    
    const column = boardData.columns[editingCard.columnId];
    const updatedItems = column.items.map(item => {
      if (item.id === editingCard.taskId) {
        return {
          ...item,
          content: editContent
        };
      }
      return item;
    });
    
    const updatedColumn = {
      ...column,
      items: updatedItems
    };
    
    const newState = {
      ...boardData,
      columns: {
        ...boardData.columns,
        [editingCard.columnId]: updatedColumn
      }
    };
    
    setBoardData(newState);
    setEditingCard(null);
    console.log(`Edited task ${editingCard.taskId} in ${column.title}`);
  };

  // Function to add a new card
  const startAddingCard = (columnId: string) => {
    setAddingCard(columnId);
    setNewCardContent("");
  };

  // Function to save a new card
  const saveNewCard = () => {
    if (!addingCard || !newCardContent.trim()) return;
    
    const column = boardData.columns[addingCard];
    const newTask = {
      id: `task-${Date.now()}`,
      content: newCardContent,
      priority: 'medium' as 'medium',
      labels: []
    };
    
    const updatedItems = [...column.items, newTask];
    
    const updatedColumn = {
      ...column,
      items: updatedItems
    };
    
    const newState = {
      ...boardData,
      columns: {
        ...boardData.columns,
        [addingCard]: updatedColumn
      }
    };
    
    setBoardData(newState);
    setAddingCard(null);
    console.log(`Added new task to ${column.title}`);
  };

  const handleTitleEdit = () => {
    setNewTitle(title);
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    if (newTitle.trim()) {
      setTitle(newTitle);
    }
    setIsEditingTitle(false);
  };

  const getPriorityClass = (priority?: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div>
      <div className="app-header-container">
        {isEditingTitle ? (
          <div className="app-title-edit">
            <input 
              type="text" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)} 
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
            />
            <div className="title-actions">
              <button onClick={handleTitleSave}>Save</button>
              <button onClick={() => setIsEditingTitle(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <h1 className="app-title" onClick={handleTitleEdit} title="Click to edit title">
            {title} <span className="edit-icon">✎</span>
          </h1>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-list">
          {boardData.columnOrder.map((columnId) => {
            const column = boardData.columns[columnId];
            return (
              <div key={column.id} className="board-column">
                <h3 className="board-title">
                  {column.title}
                  <span className="card-count">{column.items.length}</span>
                </h3>
                <Droppable
                  droppableId={column.id}
                  renderClone={(provided, snapshot, rubric) => {
                    const item = column.items[rubric.source.index];
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          transition: 'none',
                          zIndex: 1000,
                          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                          background: 'white',
                          ...provided.draggableProps.style
                        }}
                        className={`enhanced-card ${getPriorityClass(item.priority)}`}
                      >
                        {/* cloned card content */}
                        <div className="drag-handle">
                          <span className="drag-icon">⋮⋮</span>
                        </div>
                        <div className="card-content">
                          <div className="card-title">{item.content}</div>
                          {item.labels && item.labels.length > 0 && (
                            <div className="card-labels">
                              {item.labels.map((label, i) => (
                                <span key={i} className="label">{label}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ minHeight: '150px' }} // ensure droppable area stays visible
                      className={`enhanced-droppable-area ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    >
                      {column.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`enhanced-card ${snapshot.isDragging ? 'dragging' : ''} ${getPriorityClass(item.priority)}`}
                              style={{
                                transition: snapshot.isDragging
                                  ? 'none'
                                  : 'transform 250ms ease, box-shadow 250ms ease',
                                willChange: 'transform',
                                ...provided.draggableProps.style
                              }}
                            >
                              {/* ...existing card content... */}
                              {editingCard && editingCard.taskId === item.id ? (
                                <div className="edit-card-form">
                                  <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    autoFocus
                                  />
                                  <div className="edit-actions">
                                    <button onClick={saveCardEdit}>Save</button>
                                    <button onClick={() => setEditingCard(null)}>Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="drag-handle">
                                    <span className="drag-icon">⋮⋮</span>
                                  </div>
                                  <div className="card-content">
                                    <div className="card-title">{item.content}</div>
                                    {item.labels && item.labels.length > 0 && (
                                      <div className="card-labels">
                                        {item.labels.map((label, i) => (
                                          <span key={i} className="label">{label}</span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="card-actions">
                                    <button 
                                      className="edit-button"
                                      onClick={() => startEditingCard(column.id, item.id, item.content)}
                                      title="Edit card"
                                    >
                                      Edit
                                    </button>
                                    <button 
                                      className="delete-button"
                                      onClick={() => handleDeleteCard(column.id, item.id)}
                                      title="Delete card"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {addingCard === column.id ? (
                        <div className="add-card-form-enhanced">
                          <textarea
                            placeholder="Enter card title..."
                            value={newCardContent}
                            onChange={(e) => setNewCardContent(e.target.value)}
                            autoFocus
                          />
                          <div className="form-actions">
                            <button 
                              className="add-button"
                              onClick={saveNewCard}
                              disabled={!newCardContent.trim()}
                            >
                              Add Card
                            </button>
                            <button 
                              className="cancel-button"
                              onClick={() => setAddingCard(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          className="add-card-button"
                          onClick={() => startAddingCard(column.id)}
                        >
                          + Add a card
                        </button>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default WorkingDndBoard;
