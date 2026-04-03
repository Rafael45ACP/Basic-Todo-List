let ul = document.getElementById('todo');
let input = document.getElementById('taskInput');
let button = document.getElementById('addTask');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let draggedIndex = null;

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    ul.innerHTML = '';
    tasks.forEach((task, index) => {
        let li = document.createElement('li');
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;

        li.classList.add('task-item');
        
        let span = document.createElement('span');
        span.textContent = task.text;
        if (task.done) {
            span.style.textDecoration = 'line-through';
            span.style.color = 'gray';
        }

        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

      

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);
       

        li.dataset.index = index;
        ul.appendChild(li);

        li.draggable = true;
    });
}

function addTask() {
    let value = input.value.trim();
    if(!value) {
        alert('Please enter a task.');
        return;
    }
    tasks.push({ text: value, done: false });
    saveTasks();
    renderTasks();
    input.value = '';
}

button.addEventListener('click', addTask);

input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});


ul.addEventListener('mouseover', function(event) {
    let li = event.target.closest('li');
    if (li) {
        li.style.backgroundColor = 'yellow';
    }
});
ul.addEventListener('mouseout', function(event) {
    let li = event.target.closest('li');
    if (li) {
        li.style.backgroundColor = '';
    }
});

ul.addEventListener('change', function(event) {
    if (event.target.type === 'checkbox') {
        
        let li = event.target.closest('li');
        let index = li.dataset.index;
        let span = event.target.nextElementSibling;


        tasks[index].done = event.target.checked;
        if (tasks[index].done) {
            span.style.textDecoration = 'line-through';
            span.style.color = 'gray';
        } else {
            span.style.textDecoration = '';
            span.style.color = '';
        }
        saveTasks();

    }
});

ul.addEventListener('dblclick', function(event) {
    if (event.target.tagName === 'SPAN') {

        let li = event.target.closest('li');
        let index = li.dataset.index;

        let currentText = tasks[index].text;

        let editInput = document.createElement('input');
        editInput.value = currentText;
        
        event.target.replaceWith(editInput);
        editInput.focus();

        editInput.addEventListener('blur', function() {
            let newValue = editInput.value.trim() ;
            if (newValue) {
                tasks[index].text = newValue;
                tasks[index].done = false;
                
            }
            saveTasks();
            renderTasks();
        });

        editInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                editInput.blur();
            }
        });
    }
});

ul.addEventListener('dragstart', function(event) {
    let li = event.target.closest('li');
    if (li) {
        draggedIndex = li.dataset.index;
    }
    li.classList.add('dragging');
});

ul.addEventListener('dragend', function(event) {
    let li = event.target.closest('li');
    if (li) {
        li.classList.remove('dragging');
    }
});

ul.addEventListener('dragover', function(event) {
    event.preventDefault();

    let li = event.target.closest('li');
    if (!li) return;

    document.querySelectorAll('.over').forEach(el => el.classList.remove('over'));
    li.classList.add('over');
});

ul.addEventListener('drop', function(event) {
    event.preventDefault();
    let li = event.target.closest('li');
    if (!li) return;

    let targetIndex = li.dataset.index;
    
    let rect = li.getBoundingClientRect();
    let isBelow = event.clientY > rect.top + rect.height / 2;

    let draggedItem = tasks.splice(draggedIndex, 1)[0];

    if(draggedIndex < targetIndex) {
        targetIndex--;
    }

    if (isBelow) {
        tasks.splice(targetIndex + 1, 0, draggedItem);
    }
    else {
        tasks.splice(targetIndex, 0, draggedItem);
    }

    saveTasks();
    renderTasks();
});

renderTasks();
