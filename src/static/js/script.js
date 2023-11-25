document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
});

function addTask() {
    const taskInput = document.getElementById('new-task');
    const task = taskInput.value;
    taskInput.value = '';

    // Send request to backend to add task
    fetch('/todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: task }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            loadTasks();
        } else {
            alert('Error adding task');
        }
    });
}

function loadTasks() {
    fetch('/todos')
    .then(response => response.json())
    .then(tasks => {
        const tasksContainer = document.getElementById('tasks');
        tasksContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.innerHTML = `<span class="task-title">${task.task}</span>`;
            tasksContainer.appendChild(taskCard);
        });
    });
}
