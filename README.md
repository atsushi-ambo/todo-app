# Todo App

This is a simple Todo App project that helps users manage their tasks efficiently.

## Features

- Create new tasks
- Edit existing tasks
- Mark tasks as completed
- Delete tasks

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)

### Installation

1. Clone the repository:
```
git clone https://github.com/atsushi-ambo/todo-app.git
```
2. Change to the project directory:
```
cd todo-app
```
3. Build the Docker image:
```
docker build -t todo-app .
```
4. Run the Docker container:
```
docker run -d -p 80:80 --name todo-app-container todo-app
```

The app should now be accessible at `http://localhost:80/`.

## Deployment

To deploy the app, follow the instructions provided by your preferred hosting service for Docker-based applications, such as [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/docker-singlecontainer-deploy.html) or [Google Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy).

## Built With

- [Python](https://www.python.org/) - Backend programming language
- [Flask](https://flask.palletsprojects.com/) - Backend web framework
- [Node.js](https://nodejs.org/) - Frontend build tool
- [Vue.js](https://vuejs.org/) - Frontend web framework
- [Docker](https://www.docker.com/) - Containerization and deployment

