from flask import Flask
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:password@localhost/db_name'
db = SQLAlchemy(app)

# Define the Task model
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Task {self.id}: {self.title}>'

db.create_all()

# Define the Task Resource for the RESTful API
class TodoResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("title", type=str, required=True, help="Title is required")
    parser.add_argument("completed", type=bool, required=False)

    def get(self, task_id=None):
        # If task_id is provided, return a single task; otherwise, return all tasks
        if task_id:
            task = Todo.query.get_or_404(task_id)
            return {"id": task.id, "title": task.title, "completed": task.completed}
        tasks = Todo.query.all()
        return [{"id": task.id, "title": task.title, "completed": task.completed} for task in tasks]

    def post(self):
        # Create a new task
        args = self.parser.parse_args()
        new_task = Todo(title=args["title"])
        db.session.add(new_task)
        db.session.commit()
        return {"id": new_task.id, "title": new_task.title, "completed": new_task.completed}, 201

    def put(self, task_id):
        # Update an existing task
        args = self.parser.parse_args()
        task = Todo.query.get_or_404(task_id)
        task.title = args["title"]
        task.completed = args["completed"]
        db.session.commit()
        return {"id": task.id, "title": task.title, "completed": task.completed}

    def delete(self, task_id):
        # Delete a task
        task = Todo.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        return "", 204

# Add the Task Resource to the API
api.add_resource(TodoResource, "/todos", "/todos/<int:task_id>")

if __name__ == "__main__":
    app.run(debug=True)
