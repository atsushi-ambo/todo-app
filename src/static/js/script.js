function deleteTask(taskId) {
  fetch('/todo/' + taskId, { method: 'DELETE' })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        const taskElement = document.getElementById('task-' + taskId);
        taskElement.parentNode.removeChild(taskElement);
      } else {
        alert('Error deleting task');
      }
    })
    .catch(error => alert('Error deleting task: ' + error));
}

function editTask(taskId) {
  const taskElement = document.getElementById('task-' + taskId);
  const editForm = document.getElementById('edit-form-' + taskId);
  const taskDescriptionElement = taskElement.querySelector('.task-description');
  const editInput = editForm.querySelector('.edit-input');
  
  editInput.value = taskDescriptionElement.textContent;
  editForm.style.display = 'block';
}

function saveTask(taskId) {
  const editForm = document.getElementById('edit-form-' + taskId);
  const editInput = editForm.querySelector('.edit-input');
  
  fetch('/todo/' + taskId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ task: editInput.value })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      const taskDescriptionElement = document.getElementById('task-' + taskId).querySelector('.task-description');
      taskDescriptionElement.textContent = editInput.value;
      editForm.style.display = 'none';
    } else {
      alert('Error updating task');
    }
  })
  .catch(error => alert('Error updating task: ' + error));
}

function addTask() {
  const taskInput = document.getElementById('new-task-input');
  
  fetch('/todo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ task: taskInput.value })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      // Reload the page to show the new task.
      // For a better user experience, you could instead append the new task to the DOM without reloading.
      window.location.reload();
    } else {
      alert('Error adding task');
    }
  })
  .catch(error => alert('Error adding task: ' + error));
}

// Event listeners for better form handling
document.addEventListener('DOMContentLoaded', function() {
  const addTaskButton = document.getElementById('add-task-button');
  if (addTaskButton) {
    addTaskButton.addEventListener('click', addTask);
  }
  
  const saveButtons = document.querySelectorAll('.save-btn');
  saveButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      const taskId = event.target.dataset.taskId;
      saveTask(taskId);
    });
  });

  const editButtons = document.querySelectorAll('.edit-btn');
  editButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      const taskId = event.target.dataset.taskId;
      editTask(taskId);
    });
  });

  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      const taskId = event.target.dataset.taskId;
      deleteTask(taskId);
    });
  });
});
