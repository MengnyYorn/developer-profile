// State array stored in memory and restored from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// DOM Element Selectors
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const countDisplay = document.querySelector("#task-count");

function addNumbers(a, b) {
    return a + b;
}
// Save state to localStorage and update DOM
function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// Render function (Separates state from UI rendering)
function renderTasks() {
    list.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.gap = "0.5rem";
        li.style.marginBottom = "0.5rem";

        // Toggle Done Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.addEventListener("change", () => toggleTask(task.id));

        // Task Title Text
        const span = document.createElement("span");
        span.textContent = task.title;
        if (task.done) {
            span.style.textDecoration = "line-through";
            span.style.opacity = "0.6";
        }

        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.padding = "0.2rem 0.5rem";
        deleteBtn.style.fontSize = "0.8rem";
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        li.append(checkbox, span, deleteBtn);
        list.appendChild(li);
    });

    // Update Task Summary Count
    const completedCount = tasks.filter(t => t.done).length;
    if (countDisplay) {
        countDisplay.textContent = `Total tasks: ${tasks.length} | Completed: ${completedCount}`;
    }
}

// Add New Task
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    const newTask = {
        id: Date.now(),
        title: value,
        done: false
    };

    tasks.push(newTask);
    input.value = "";
    input.focus();
    saveAndRender();
});

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, done: !task.done } : task
    );
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}
renderTasks();