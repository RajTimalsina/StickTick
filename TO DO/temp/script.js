document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addButton = document.getElementById("add-button");
  const todoList = document.getElementById("todo-list");
  const filterButtons = document.querySelectorAll(".filter-button");

  // Load tasks from local storage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Function to render tasks
  function renderTasks(filter = "all") {
    todoList.innerHTML = "";

    const filteredTasks = tasks.filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    });

    filteredTasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <button onclick="toggleComplete(${index})">${
        task.completed ? "Undo" : "Complete"
      }</button>
                    <button onclick="deleteTask(${index})">Delete</button>
                </div>
            `;
      todoList.appendChild(li);
    });
  }

  // Function to add a new task
  function addTask() {
    const taskText = todoInput.value.trim();
    if (taskText) {
      tasks.push({ text: taskText, completed: false });
      todoInput.value = "";
      saveTasks();
      renderTasks();
    }
  }

  // Function to toggle task completion
  window.toggleComplete = function (index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  };

  // Function to delete a task
  window.deleteTask = function (index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  };

  // Function to save tasks to local storage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Event listeners
  addButton.addEventListener("click", addTask);
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      renderTasks(button.dataset.filter);
    });
  });

  // Initial render
  renderTasks();
});
