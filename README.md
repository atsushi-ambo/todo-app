# Todo-App

A simple yet interactive To-Do application that allows users to manage their tasks effectively. Built with Flask for the backend, MySQL for the database, and simple HTML/CSS for the frontend.

## Features

- Add new tasks to your to-do list.
- Edit existing tasks.
- Delete tasks you've completed or no longer need to track.
- Persistent storage with MySQL.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository:
```bash
git clone https://github.com/atsushi-ambo/todo-app.git
```

2. Navigate to the project directory:
```bash
cd todo-app
```

3. Create a `.env` file at the root of the project with the following content:
```env
MYSQL_ROOT_PASSWORD=yourpassword
```
Replace `yourpassword` with a secure password of your choosing.

4. Build and start the containers using Docker Compose:
```bash
docker-compose up --build
```
The app will be served at `http://localhost:3000`.

## Usage

Use the web interface to add, edit, or delete tasks. The application provides a straightforward and intuitive user interface for managing your to-do list.

## Running Tests

Currently, there are no tests written for this application. Tests could be written using frameworks like `unittest` or `pytest` for Python.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Deployment

This application is configured for development purposes and is not ready for production deployment. Please ensure you configure it properly for production environments before any deployment.

## Built With

- [Flask](http://flask.pocoo.org/) - The web framework used.
- [MySQL](https://www.mysql.com/) - Open-source relational database.
- [Docker](https://www.docker.com/) - Containerization and deployment.
