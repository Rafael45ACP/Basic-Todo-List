let ul = document.getElementById('todo');
let input = document.getElementById('taskInput');
let button = document.getElementById('addTask');

function addTask() {
    let task = input.value.trim();
    if (task) {
        let li = document.createElement('li');
        li.textContent = task;
        ul.appendChild(li);
        input.value = '';
    }
    else {
        alert('Please enter a task.');
    }
}

button.addEventListener('click', addTask);

input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});


ul.addEventListener('mouseover', function(event) {
    if (event.target.tagName === 'LI') {
        event.target.style.backgroundColor = 'yellow';
    }   
});
ul.addEventListener('mouseout', function(event) {
    if (event.target.tagName === 'LI') {
        event.target.style.backgroundColor = '';
    }
});

ul.addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
        this.removeChild(event.target);
    }
});
