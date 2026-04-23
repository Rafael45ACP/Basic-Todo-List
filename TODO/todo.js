let ul = document.getElementById('todo');
let input = document.getElementById('taskInput');
let button = document.getElementById('addTask');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let draggedIndex = null;

let filter = 'all';
let allFilter = document.getElementById('ALL');
let activeFilter = document.getElementById('ACTIVE');
let completedFilter = document.getElementById('COMPLETED');

let categoryFilter = document.getElementById('filterCategory');

let UndoBTN = document.getElementById('Undo');
let lastDeleted = null;

let darkModeButton = document.getElementById('DarkMode');
let clearCompletedButton = document.getElementById('clearCompleted');


clearCompletedButton.addEventListener('click', function() {
    tasks = tasks.filter(task => !task.done);
    saveTasks();
    renderTasks();
});

class Stack {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item);
    }

    pop() {
        return this.items.pop();
    }
    isEmpty() {
        return this.items.length === 0;
    }
}

let undoStack = new Stack();


function numActiveTasks() {
    return tasks.filter(task => !task.done).length;
}

function numCompletedTasks() {
    return tasks.filter(task => task.done).length;
}

function numTotalTasks() {
    return tasks.length;
}




function getPositions(){
    let items = document.querySelectorAll('#todo li');
    let map = new Map();
    items.forEach((item => {
        let index = item.dataset.index;
        let rect = item.getBoundingClientRect();
        map.set(index, rect);
    }));

    return map;
}

function animateFlip(oldPositions){
    let items = document.querySelectorAll('#todo li');
    items.forEach(item => {
        let index = item.dataset.index;
        let old = oldPositions.get(index);
        let newRect = item.getBoundingClientRect();

        if(!old) return;

        let deltaX = old.left - newRect.left;
        let deltaY = old.top - newRect.top;

        if(deltaX || deltaY) {
            item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            item.style.transition = 'transform 0s';

            requestAnimationFrame(() => {
                item.style.transform = '';
                item.style.transition = 'transform 200ms ease';
            });
}
});
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    ul.innerHTML = '';
    tasks.forEach((task, index) => {

        if (filter === 'active' && task.done) return;
        if (filter === 'completed' && !task.done) return;
        if(categoryFilter.value !== 'None' && task.category !== categoryFilter.value) return;

        let now = new Date();
        
        let li = document.createElement('li');
        li.classList.add('task-item','enter');
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
         
        li.classList.add('task-item');
        
        let span = document.createElement('span');
        span.textContent = task.text;

        let categorySpan = document.createElement('span');
        categorySpan.textContent = ` [${task.category}]`;
        categorySpan.style.fontStyle = 'italic';
        if(task.category === 'Gym') {
            categorySpan.style.color = 'blue';
        }
        else if(task.category === 'Personal') {
        categorySpan.style.color = 'green';
        }
        else if(task.category === 'School') {
            categorySpan.style.color = 'yellow';
        }
        else {
            categorySpan.textContent = '';
        }

        let deadlineSpan = document.createElement('span');

        if (task.done) {
            span.style.textDecoration = 'line-through';
            span.style.color = 'gray';
        }

        let timeleftSpan = document.createElement('span');
        
        let activeCount = document.getElementById('activeCount');
        let completedCount = document.getElementById('completedCount');
        let totalCount = document.getElementById('totalCount');

        activeCount.textContent = numActiveTasks();
        completedCount.textContent = numCompletedTasks();
        totalCount.textContent = numTotalTasks();

        let descButton = document.createElement('button');
        descButton.textContent = task.description
            ? (task.showDesc ? 'Hide Description' : 'Show Description')
            : 'Add Description';

        descButton.addEventListener('click', function () {

            // If NO description yet → create one
            if (!task.description) {
                let descInput = document.createElement('input');
                descInput.placeholder = 'Enter description';

                li.appendChild(descInput);
                descInput.focus();

                descInput.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter') {
                        task.description = descInput.value.trim();
                        task.showDesc = true;

                        saveTasks();
                        renderTasks();
                    }
                });

                descInput.addEventListener('blur', function () {
                    task.description = descInput.value.trim();
                    task.showDesc = true;

                    saveTasks();
                    renderTasks();
                });

                return;
            }

            // Otherwise → toggle visibility
            task.showDesc = !task.showDesc;

            saveTasks();
            renderTasks();
        });

        
        
        let div = document.createElement('div');
        
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            lastDeleted = tasks[index];
            undoStack.push(lastDeleted);
            SaveUndoStack();            
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        

      

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(categorySpan);
        if (task.deadline) {
            let deadline = new Date(task.deadline);
            deadline.setHours(23, 59, 59);
            deadlineSpan.textContent = ` (Deadline: ${task.deadline})`;
            deadlineSpan.style.fontStyle = 'Bold';
            
            if (deadline.toDateString() > now.toDateString() || task.done) {
                deadlineSpan.style.color = 'green';
            }
            else if (deadline.toDateString() < now.toDateString() && !task.done) {
                deadlineSpan.style.color = 'red';
            }

            else if (deadline.toDateString() === now.toDateString()) {
                deadlineSpan.style.color = 'orange';
                console.log('Deadline is today!');
            }
            
            if(task.done) {
                deadlineSpan.style.color = 'grey';
            }

            li.appendChild(deadlineSpan);
        }
        if (task.deadline) {
            let deadline = new Date(task.deadline);
            deadline.setHours(23, 59, 59);
            let timeLeft = deadline - now;
            
                let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                timeleftSpan.textContent = ` (${days}d ${hours}h ${minutes}m left)`;
                timeleftSpan.style.fontWeight = 'bold';
                
                if (timeLeft < 0 && !task.done) {
                    timeleftSpan.textContent = ' (Overdue)';
                    timeleftSpan.style.color = 'red';
                }
                else if (timeLeft <= 24 * 60 * 60 * 1000 && !task.done) {
                    timeleftSpan.style.color = 'orange';
                }
                else if (timeLeft <= 3 * 24 * 60 * 60 * 1000 && !task.done) {
                    timeleftSpan.style.color = 'yellow';
                }
                else if(task.done){
                    timeleftSpan.textContent = '';
                }
                else {
                    timeleftSpan.style.color = 'green';
                }
                li.appendChild(timeleftSpan);
            
            }

        li.appendChild(descButton);

        if (task.description && task.showDesc) {
            let descText = document.createElement('span');
            descText.textContent = ' - ' + task.description;
            descText.style.fontStyle = 'italic';
            let br = document.createElement('br');

            li.appendChild(br);
            li.appendChild(descText);
        }
        li.appendChild(div);
        div.appendChild(deleteButton);
    



        li.dataset.index = index;
        ul.appendChild(li);
        requestAnimationFrame(() => {
            li.classList.add('enter-active');
        });

        li.addEventListener('transitionend', function() {
            li.classList.remove('enter', 'enter-active');
        }, { once: true });

        li.draggable = true;

       

    });
}

function addTask() {
    let value = input.value.trim();
    if(!value) {
        alert('Please enter a task.');
        return;
    }
    let category = document.getElementById('sort').value;
    let deadline = document.getElementById('deadlineInput').value;


    tasks.push({ text: value, done: false, category: category, deadline: deadline, description: '',
        showDesc: false
     });
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
    if (li && localStorage.getItem('darkMode') === 'enabled') {
        li.style.backgroundColor = 'purple';
    }
    else if (li) {
        li.style.backgroundColor = 'lightgray';
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
        renderTasks();

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
            if (newValue != currentText) {
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

    let oldPositions = getPositions();
    saveTasks();
    renderTasks();
    animateFlip(oldPositions);
});

function setFilter(selectedFilter)
{    
    filter = selectedFilter;
    allFilter.checked = selectedFilter === 'all';
    activeFilter.checked = selectedFilter === 'active';
    completedFilter.checked = selectedFilter === 'completed';
  
    renderTasks();
}

allFilter.addEventListener('change', () => setFilter('all'));
activeFilter.addEventListener('change', () => setFilter('active'));
completedFilter.addEventListener('change', () => setFilter('completed'));

categoryFilter.addEventListener('change', function() {
    let selectedCat = categoryFilter.value;
    if(selectedCat !== 'None') {
        renderTasks();
    }
    else {
        renderTasks();
    }
});

UndoBTN.addEventListener('click', function(){
    if(!undoStack.isEmpty()) {
        tasks.push(undoStack.pop());
        SaveUndoStack();
        saveTasks();
        renderTasks();
    }
    else{
        alert('No Task to Undo!');
    }


});

function SaveUndoStack()
{
    localStorage.setItem('undoStack', JSON.stringify(undoStack.items));
}

function loadUndoStack(){
    let storedStack = localStorage.getItem('undoStack');
    if(storedStack){
        let items = JSON.parse(storedStack);
        undoStack.items = [];
        items.forEach(item => undoStack.push(item));
    }

}
loadUndoStack();

darkModeButton.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');

    localStorage.setItem(
        'darkMode', 
        document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled'
    )
});

// Check local storage for dark mode preference on page load
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}

setFilter('all');

renderTasks();


