let ul = document.getElementById('todo');
let input = document.getElementById('taskInput');
let button = document.getElementById('addTask');

function addTask() {
    let task = input.value.trim();
    if (task) {
        let li = document.createElement('li');
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        li.appendChild(checkbox);
        let span = document.createElement('span');
        span.textContent = task;
        li.appendChild(span);

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

ul.addEventListener('click', function(event) {
    if (event.target.tagName === 'SPAN') {
        event.target.parentElement.remove();
    }
});

ul.addEventListener('change', function(event) {
    if (event.target.type === 'checkbox') {
        let span = event.target.nextElementSibling;
        if (event.target.checked) {
            span.style.textDecoration = 'line-through';
            span.style.color = 'gray';
        } else {
            span.style.textDecoration = '';
            span.style.color = '';
        }
    }
});
