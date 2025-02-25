CREATE DATABASE IF NOT EXISTS trello_db;
USE trello_db;

-- Create tables
CREATE TABLE IF NOT EXISTS boards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS columns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    column_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    position INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
);

-- Insert initial board
INSERT INTO boards (name) VALUES ('My First Board');

-- Insert default columns
INSERT INTO columns (board_id, name, position) VALUES 
    (1, 'Todo', 0),
    (1, 'In Progress', 1),
    (1, 'Done', 2);

-- Insert some sample cards
INSERT INTO cards (column_id, title, description, position) VALUES 
    (1, 'Welcome to your board', 'Try dragging this card to another column', 0),
    (1, 'Add more cards', 'Click "Add a card" below any column', 1),
    (2, 'This card is in progress', 'You can edit or delete this card', 0);
