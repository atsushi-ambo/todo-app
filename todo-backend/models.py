from flask_sqlalchemy import SQLAlchemy
from app import app

# Initialize SQLAlchemy with the Flask app
db = SQLAlchemy(app)

# Define the Todo model
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<Todo {self.id}: {self.title}>"
