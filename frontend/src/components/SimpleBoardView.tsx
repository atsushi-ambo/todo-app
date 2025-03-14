import React, { useState } from 'react';

// Export this interface to make the file a module
export interface CardItem {
  id: string;
  content: string;
}

interface BoardColumn {
  id: string;
  title: string;
  items: CardItem[];
}

const SimpleBoardView: React.FC = () => {
  const [boards, setBoards] = useState<BoardColumn[]>([
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

  return (
    <div className="board-list">
      {boards.map((board) => (
        <div key={board.id} className="board-column">
          <h3 className="board-title">{board.title}</h3>
          <div className="simple-droppable-area">
            {board.items.map((item) => (
              <div key={item.id} className="simple-card">
                {item.content}
              </div>
            ))}
            {board.items.length === 0 && (
              <div className="empty-message">No items</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Export the component as default
export default SimpleBoardView;
