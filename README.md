# To-do App

## Description
This is a simple to-do application with a RESTful API backend built using Flask and a frontend built using Vue.js. The backend is hosted on AWS RDS and the frontend is served using Nginx on a Docker container.

## Setup
To run this application locally, follow these steps:

1. Clone this repository: `git clone https://github.com/YOUR_USERNAME/todo-app.git`
2. Navigate to the cloned directory: `cd todo-app`
3. Build the Docker image: `docker build -t todo-app .`
4. Run the Docker container: `docker run -p 80:80 todo-app`

You should now be able to access the application by going to `http://localhost` in your web browser.

## Backend
The backend is a simple RESTful API built using Flask and Flask-RESTful. It uses a SQLite database to store the to-do items.

### Requirements
To run the backend, you must have Python 3.8 installed on your system. You can install the required Python packages by running `pip install -r todo-backend/requirements.txt`.

### Endpoints
The following endpoints are available in the backend:

- `GET /todos` - Retrieves a list of all to-do items.
- `GET /todos/<id>` - Retrieves a single to-do item by ID.
- `POST /todos` - Creates a new to-do item.
- `PUT /todos/<id>` - Updates a to-do item by ID.
- `DELETE /todos/<id>` - Deletes a to-do item by ID.

## Frontend
The frontend is built using Vue.js and is served using Nginx on a Docker container.

### Requirements
To run the frontend, you must have Node.js and npm installed on your system. You can install the required dependencies by running `npm install` in the `todo-frontend` directory.

### Usage
To start the frontend, run `npm run serve` in the `todo-frontend` directory. You can then access the frontend by going to `http://localhost:8080` in your web browser.

## Infrastructure
The infrastructure is managed using Terraform and AWS. The backend is hosted on AWS RDS and the frontend is served using Nginx on a Docker container.

### Requirements
To manage the infrastructure, you must have Terraform installed on your system. You can install Terraform by following the instructions on the Terraform website.

### Usage
To create the infrastructure, follow these steps:

1. Set your AWS credentials as environment variables: `export AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY> && export AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>`
2. Navigate to the `infrastructure` directory: `cd infrastructure`
3. Initialize Terraform: `terraform init`
4. Plan the infrastructure: `terraform plan`
5. Apply the infrastructure: `terraform apply`

To destroy the infrastructure, run `terraform destroy`.

## Contributors
- Your Name - [@yourusername](https://github.com/yourusername)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
