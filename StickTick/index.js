const taskInput = document.querySelector(".task-input input");
taskBox = document.querySelector(".task-box");
filters = document.querySelectorAll(".filters span");
let editId;
let isEditedTask = false;
let todos = JSON.parse(localStorage.getItem("todo-list"));
clearAll = document.querySelector(".clear-btn");
all = document.querySelector(".filter#all");

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

clearAll.addEventListener("click", () => {
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
});

function showTodo(filter) {
  let li = "";

  if (todos) {
    todos.forEach((todo, id) => {
      let isCompleted = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        li += `<li class="task">
                <label for="${id}" class="task">
                  <input onclick="updateStatus(this)" type="checkbox" name="" id="${id}" class="checkbox" ${isCompleted} />
                  <p class="${isCompleted}">${todo.name}</p>
                </label>
                <div class="settings">
                  <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                  <ul class="task-menu">
                    <li onclick="editTask(${id}, '${todo.name}')"><i class="uil uil-pen"></i>Edit</li>
                    <hr class="uil" />
                    <li onclick="deleteTask(${id})"><i class="uil uil-trash"></i>Delete</li>
                  </ul>
                </div>
              </li>`;
      }
    });
  }

  taskBox.innerHTML = li || `<span class="emptyTask">No Task Here :)</span>`;
}

function showMenu(seclectedTask) {
  let taskMenu = seclectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != seclectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

function editTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
}

function deleteTask(deleteId) {
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
}

function updateStatus(seclectedTask) {
  let taskName = seclectedTask.parentElement.lastElementChild;
  if (seclectedTask.checked) {
    taskName.classList.add("checked");
    todos[seclectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[seclectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}
showTodo("all");
taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    if (!isEditedTask) {
      if (!todos) {
        todos = [];
      }
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo);
    } else {
      isEditedTask = false;
      todos[editId].name = userTask;
    }

    localStorage.setItem("todo-list", JSON.stringify(todos));
    taskInput.value = "";
    showTodo("all");
  }
});
