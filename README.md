# Trello Clone App

A modern Kanban board application inspired by Trello, built with TypeScript, React, Node.js, and MySQL. Features drag-and-drop functionality and a clean, responsive interface.

## Features

- 📋 Kanban board with multiple columns (Todo, In Progress, Done, etc.)
- 🎯 Create, edit, and delete cards
- 🔄 Drag and drop cards between columns
- 💾 Persistent storage with MySQL database
- 🎨 Clean and modern UI with GMO-inspired theme
- 🚀 Real-time updates
- 📱 Responsive design

## Tech Stack

### Frontend
- React with TypeScript
- Styled Components for styling
- React Beautiful DnD for drag-and-drop functionality

### Backend
- Node.js with Express
- TypeScript
- MySQL for database
- CORS enabled API

### Infrastructure
- Docker and Docker Compose for containerization
- Multi-container architecture (frontend, backend, database)

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/atsushi-ambo/todo-app.git
cd todo-app
```

2. Start the application using Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- MySQL Database: localhost:3306

## Development

### Project Structure
```
todo-app/
├── frontend/           # React frontend application
│   ├── src/           
│   │   ├── components/  # React components
│   │   ├── services/   # API services
│   │   └── types/      # TypeScript types
│   └── Dockerfile
├── backend/           # Node.js backend application
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── db/
│   │   └── models/
│   └── Dockerfile
├── mysql/            # MySQL database
│   └── init.sql      # Database initialization
└── docker-compose.yml
```

### API Endpoints

- `GET /api/boards` - Get all boards
- `GET /api/boards/:id` - Get a specific board
- `POST /api/cards` - Create a new card
- `PUT /api/cards/:id` - Update a card
- `DELETE /api/cards/:id` - Delete a card

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Trello's excellent UI/UX
- Theme colors inspired by GMO's corporate design
- Built with modern web development best practices
