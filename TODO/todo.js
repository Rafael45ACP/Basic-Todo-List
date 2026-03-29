let ul = document.getElementById('todo');
let input = document.getElementById('taskInput');
let button = document.getElementById('addTask');

button.addEventListener('click enterkey', function() {
    let task = input.value;
    if (task) {
        let li = document.createElement('li');
        li.textContent = task;
        ul.appendChild(li);
        input.value = '';
    }
    else {        alert('Please enter a task!');
    }           
}
);

ul.addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
        ul.removeChild(event.target);
    }
});

ul.addEventListener('mouseover', function(event) {
    if (event.target.tagName === 'LI') {
        event.target.style.textDecoration = 'highlight';
    }   
});
ul.addEventListener('mouseout', function(event) {
    if (event.target.tagName === 'LI') {
        event.target.style.textDecoration = 'none';
    }
});
