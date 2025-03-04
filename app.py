from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

tasks = []  # Stores tasks in-memory

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

@app.route('/add_task', methods=['POST'])
def add_task():
    data = request.json
    task = {
        'id': len(tasks) + 1,
        'name': data['name'],
        'assignee': data['assignee'],
        'priority': data['priority'],
        'deadline': data['deadline'],
        'progress': 'Not Started',
        'days': []  # Empty, will be updated when dragged
    }
    tasks.append(task)
    return jsonify({'message': 'Task added', 'task': task})

@app.route('/update_task', methods=['POST'])
def update_task():
    data = request.json
    for task in tasks:
        if task['id'] == data['id']:
            task['days'] = data['days']
            return jsonify({'message': 'Task updated', 'task': task})
    return jsonify({'error': 'Task not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
