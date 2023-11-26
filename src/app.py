from flask import Flask, jsonify, request, render_template
import mysql.connector
from mysql.connector import Error
import time
import os

app = Flask(__name__)

def connect_with_retry():
    for _ in range(5):  # Try to connect up to 5 times
        try:
            db = mysql.connector.connect(
                host="mysql",
                user="root",
                password=os.getenv('MYSQL_ROOT_PASSWORD', 'defaultpassword'),
                database="todo_db"
            )
            return db
        except Error as e:
            print(f"Error connecting to MySQL: {e}, retrying in 5 seconds...")
            time.sleep(5)
    raise Exception("Failed to connect to MySQL after several attempts")

# Establish database connection
db = connect_with_retry()

@app.route('/')
def index():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM todos")
    todos = cursor.fetchall()
    cursor.close()
    return render_template('index.html', tasks=todos)

@app.route('/todo', methods=['POST'])
def add_todo():
    data = request.json
    task = data.get('task')
    cursor = db.cursor()
    cursor.execute("INSERT INTO todos (task) VALUES (%s)", (task,))
    db.commit()
    cursor.close()
    return jsonify({'status': 'success', 'message': 'Task added'})

@app.route('/todo/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.json
    task = data.get('task')
    cursor = db.cursor()
    cursor.execute("UPDATE todos SET task = %s WHERE id = %s", (task, todo_id))
    affected_rows = cursor.rowcount
    db.commit()
    cursor.close()
    if affected_rows == 0:
        return jsonify({'status': 'failed', 'message': 'No task found with the provided ID'}), 404
    return jsonify({'status': 'success', 'message': 'Task updated'})

@app.route('/todo/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    cursor = db.cursor()
    cursor.execute("DELETE FROM todos WHERE id = %s", (todo_id,))
    affected_rows = cursor.rowcount
    db.commit()
    cursor.close()
    if affected_rows == 0:
        return jsonify({'status': 'failed', 'message': 'No task found with the provided ID'}), 404
    return jsonify({'status': 'success', 'message': 'Task deleted'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
