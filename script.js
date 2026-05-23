let totalTasks = 0;
let completedTasks = 0;

window.onload = function () {
  loadTasks();
};
function updateProgress() {
  const progress = document.getElementById("progress");
  const count = document.getElementById("count");

  if (totalTasks === 0) {
    progress.style.width = "0%";
    count.innerText = "0 / 0";
    return;
  }
  const percent = (completedTasks / totalTasks) * 100;
  progress.style.width = percent + "%";
  count.innerText = `${completedTasks} / ${totalTasks}`;
}

function saveTasks() {
  const allTasks = [];
  const taskList = document.querySelectorAll("#taskList li");

  taskList.forEach(li => {
    const text = li.querySelector(".task-text").textContent;
    const date = li.querySelector(".task-date").textContent;
    const completed = li.querySelector(".task-text").classList.contains("completed");

    allTasks.push({
      text: text,
      date: date,
      completed: completed
    });
  });

  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  savedTasks.forEach(task => {
    createTask(task.text, task.date, task.completed);
  });
}

function addTask() {
  const input = document.getElementById("taskInput");
  const dueDate = document.getElementById("dueDate");

  const text = input.value.trim();
  const date = dueDate.value;

  if (text === "") return;

  createTask(text, date, false);

  input.value = "";
  dueDate.value = "";

  saveTasks();
}

// Create task
function createTask(text, date, isCompleted = false) {
  const li = document.createElement("li");

  const left = document.createElement("div");

  const span = document.createElement("span");
  span.textContent = text;
  span.className = "task-text";

  const smallDate = document.createElement("div");
  smallDate.className = "task-date";
  smallDate.textContent = date ? date : "No Date";

  if (isCompleted) {
    span.classList.add("completed");
    completedTasks++;
  }

  left.appendChild(span);
  left.appendChild(smallDate);

  const actions = document.createElement("div");
  actions.className = "actions";

  // Complete button
  const checkBtn = document.createElement("button");
  checkBtn.textContent = "✔";
  checkBtn.className = "check";

  checkBtn.onclick = function () {
    if (!span.classList.contains("completed")) {
      span.classList.add("completed");
      completedTasks++;
    } else {
      span.classList.remove("completed");
      completedTasks--;
    }

    updateProgress();
    saveTasks();
    filterTasks(currentFilter);
  };

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑";
  deleteBtn.className = "delete";

  deleteBtn.onclick = function () {
    if (span.classList.contains("completed")) {
      completedTasks--;
    }

    totalTasks--;
    li.remove();

    updateProgress();
    saveTasks();
  };

  actions.appendChild(checkBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(left);
  li.appendChild(actions);

  document.getElementById("taskList").appendChild(li);

  totalTasks++;
  updateProgress();
}

// Clear all tasks
function clearAllTasks() {
  document.getElementById("taskList").innerHTML = "";

  totalTasks = 0;
  completedTasks = 0;

  localStorage.removeItem("tasks");

  updateProgress();
}

// FILTER TASKS
let currentFilter = "all";

function filterTasks(type) {
  currentFilter = type;

  const tasks = document.querySelectorAll("#taskList li");

  tasks.forEach(li => {
    const task = li.querySelector(".task-text");
    const completed = task.classList.contains("completed");

    if (type === "all") {
      li.style.display = "flex";
    } 
    else if (type === "completed") {
      li.style.display = completed ? "flex" : "none";
    } 
    else if (type === "pending") {
      li.style.display = completed ? "none" : "flex";
    }
  });
}

