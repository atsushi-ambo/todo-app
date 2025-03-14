import * as React from 'react';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useDragScroll } from '../hooks/useDragScroll';

interface CardItem {
  id: string;
  content: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  labels?: string[];
}

interface BoardColumn {
  id: string;
  title: string;
  items: CardItem[];
}

const DemoBoard: React.FC = () => {
  const [boards, setBoards] = useState<BoardColumn[]>([
    {
      id: '1',
      title: 'To Do',
      items: [
        { id: '101', content: 'Create user registration', priority: 'high', labels: ['feature'] },
        { id: '102', content: 'Design database schema', priority: 'medium', labels: ['design'] }
      ]
    },
    {
      id: '2',
      title: 'In Progress',
      items: [
        { id: '103', content: 'Set up CI/CD pipeline', priority: 'medium', labels: ['devops'] }
      ]
    },
    {
      id: '3',
      title: 'Done',
      items: [
        { id: '104', content: 'Project setup', priority: 'low', labels: ['setup'] },
        { id: '105', content: 'Create repository', priority: 'low', labels: ['setup'] }
      ]
    }
  ]);
  
  const [appTitle, setAppTitle] = useState("Board Management App");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCardContent, setNewCardContent] = useState<{ [key: string]: string }>({});
  const [showAddForm, setShowAddForm] = useState<{ [key: string]: boolean }>({});
  const [editingCard, setEditingCard] = useState<{ boardId: string, cardId: string } | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Use the drag scroll hook
  useDragScroll();
  
  // Set document title for browser tab
  useEffect(() => {
    document.title = "To-Do App";
  }, []);

  // Function to handle deleting a card
  const handleDeleteCard = (boardId: string, cardId: string) => {
    if (window.confirm('Are you sure you want to remove this card?')) {
      setBoards(boards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            items: board.items.filter(item => item.id !== cardId)
          };
        }
        return board;
      }));
    }
  };

  // Function to handle adding a new card
  const handleAddCard = (boardId: string) => {
    if (!newCardContent[boardId]?.trim()) return;
    
    setBoards(boards.map(board => {
      if (board.id === boardId) {
        const newCardId = `card-${Date.now()}`;
        return {
          ...board,
          items: [
            ...board.items,
            { 
              id: newCardId, 
              content: newCardContent[boardId],
              priority: 'medium' 
            }
          ]
        };
      }
      return board;
    }));
    
    // Reset input field and hide form
    setNewCardContent({
      ...newCardContent,
      [boardId]: ''
    });
    setShowAddForm({
      ...showAddForm,
      [boardId]: false
    });
  };

  // Function to toggle edit mode
  const startEditing = (boardId: string, cardId: string, content: string) => {
    setEditingCard({ boardId, cardId });
    setEditContent(content);
  };

  // Function to save edited content
  const saveEdit = () => {
    if (!editingCard) return;

    setBoards(boards.map(board => {
      if (board.id === editingCard.boardId) {
        return {
          ...board,
          items: board.items.map(item => {
            if (item.id === editingCard.cardId) {
              return {
                ...item,
                content: editContent
              };
            }
            return item;
          })
        };
      }
      return board;
    }));
    setEditingCard(null);
  };

  // Function to handle title edit
  const handleTitleEdit = () => {
    setNewTitle(appTitle);
    setIsEditingTitle(true);
  };

  // Function to save new title
  const handleTitleSave = () => {
    if (newTitle.trim()) {
      setAppTitle(newTitle);
    }
    setIsEditingTitle(false);
  };

  // Function to handle when drag starts
  const handleDragStart = () => {
    setIsDragging(true);
    // Add a dragging class to the body for global styling during drag
    document.body.classList.add('is-dragging');
  };

  // Function to handle drag and drop - fixed to properly update state
  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    document.body.classList.remove('is-dragging');
    
    const { source, destination } = result;
    console.log('Drag ended:', { source, destination }); // Debug logging

    // If dropped outside a droppable area
    if (!destination) {
      console.log('No destination, aborting drag');
      return;
    }

    // If dropped in the same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      console.log('Dropped in same position, aborting drag');
      return;
    }

    // Create a deep copy of the boards array
    const newBoards = JSON.parse(JSON.stringify(boards));
    
    // Find source and destination boards in the copied array
    const sourceBoard = newBoards.find((b: BoardColumn) => b.id === source.droppableId);
    const destBoard = newBoards.find((b: BoardColumn) => b.id === destination.droppableId);
    
    if (!sourceBoard || !destBoard) {
      console.log('Could not find source or destination board', { 
        sourceId: source.droppableId, 
        destId: destination.droppableId, 
        boardIds: boards.map(b => b.id)
      });
      return;
    }

    console.log('Moving item from', sourceBoard.title, 'to', destBoard.title);
    
    // Get the item being moved
    const [movedItem] = sourceBoard.items.splice(source.index, 1);
    
    // Insert it at the new position
    destBoard.items.splice(destination.index, 0, movedItem);
    
    // Update state
    setBoards(newBoards);

    // Add visual feedback
    setTimeout(() => {
      const element = document.getElementById(`card-${result.draggableId}`);
      if (element) {
        element.classList.add('drop-success');
        setTimeout(() => element.classList.remove('drop-success'), 500);
      }
    }, 100);
  };

  // Function to get correct drag styles 
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // Some basic styles for draggable items
    userSelect: 'none',
    ...draggableStyle
  });

  // Function to get priority class
  const getPriorityClass = (priority?: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <>
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
            {appTitle} <span className="edit-icon">✎</span>
          </h1>
        )}
      </div>
      
      <DragDropContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={`board-list ${isDragging ? 'dragging-active' : ''}`}>
          {boards.map((board) => (
            <div key={board.id} className="board-column">
              <h3 className="board-title">
                {board.title}
                <span className="card-count">{board.items.length}</span>
              </h3>
              
              <Droppable droppableId={board.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`enhanced-droppable-area ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    data-column-id={board.id}
                  >
                    {board.items.map((item, index) => (
                      <Draggable 
                        key={item.id} 
                        draggableId={item.id} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            id={`card-${item.id}`}
                            className={`enhanced-card ${snapshot.isDragging ? 'dragging' : ''} ${getPriorityClass(item.priority)}`}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {editingCard && editingCard.cardId === item.id ? (
                              <div className="edit-card-form">
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  autoFocus
                                />
                                <div className="edit-actions">
                                  <button onClick={saveEdit}>Save</button>
                                  <button onClick={() => setEditingCard(null)}>Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div 
                                  {...provided.dragHandleProps}
                                  className="drag-handle"
                                  title="Drag to reorder"
                                >
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
                                    onClick={() => startEditing(board.id, item.id, item.content)}
                                    title="Edit card"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    className="delete-button"
                                    onClick={() => handleDeleteCard(board.id, item.id)}
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
                    
                    {showAddForm[board.id] ? (
                      <div className="add-card-form-enhanced">
                        <textarea
                          placeholder="Enter card title..."
                          value={newCardContent[board.id] || ''}
                          onChange={(e) => setNewCardContent({
                            ...newCardContent,
                            [board.id]: e.target.value
                          })}
                          autoFocus
                        />
                        <div className="form-actions">
                          <button 
                            className="add-button"
                            onClick={() => handleAddCard(board.id)}
                            disabled={!newCardContent[board.id]?.trim()}
                          >
                            Add Card
                          </button>
                          <button 
                            className="cancel-button"
                            onClick={() => setShowAddForm({...showAddForm, [board.id]: false})}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        className="add-card-button"
                        onClick={() => setShowAddForm({...showAddForm, [board.id]: true})}
                      >
                        + Add a card
                      </button>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </>  
  );
};

export default DemoBoard;
