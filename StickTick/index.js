const taskInput = document.querySelector(".task-input input");
let taskBox = document.querySelector(".task-box");
let filters = document.querySelectorAll(".filters span");
let editId;
let isEditedTask = false;
let todos = JSON.parse(localStorage.getItem("todo-list")) || [];
let clearAll = document.querySelector(".clear-btn");
let all = document.querySelector(".filter#all");
var countAll = todos.length;
var countPending = 0;
var countCompleted = 0;



// counts number of completed and pending works
for (let i = 0; i < todos.length; i++){
  if (todos[i].status == "pending"){
    countPending++;
  }
  else{
    countCompleted++;
  }

}

let allCount = document.querySelector(".count-all");
let pendingCount = document.querySelector(".count-pending");
let completedCount = document.querySelector(".count-completed");


counterShow();
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

clearAll.addEventListener("click", () => {
  todos = []
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
  countAll = 0;
  countPending = 0;
  countCompleted = 0;
  counterShow();
});


function showTodo(filter) {
  let li = "";
  if (todos) {
    for (let id = todos.length - 1; id >= 0; id--) {
      let todo = todos[id];
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
    }
  }

  taskBox.innerHTML = li || `<span class="emptyTask">No Task Here :)</span>`;
}

function showMenu(selectedTask) {
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
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
  let removedItem = todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
  if (removedItem[0].status == 'pending') {
    updateCounter(-1, -1, 0);
  }
  else{
    updateCounter(-1, 0, -1);
  }
}

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  console.log(selectedTask.checked)
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
    console.log("Hello")
    updateCounter(0, -1, 1);
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
    updateCounter(0, 1, -1);
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
      updateCounter(1, 1, 0);
    } else {
      isEditedTask = false;
      todos[editId].name = userTask;
    }

    localStorage.setItem("todo-list", JSON.stringify(todos));
    taskInput.value = "";
    showTodo("all");
  }
});

function updateCounter(all, pending, completed){
  console.log("Hi", all, pending, completed);
  countAll += all;
  countPending += pending;
  countCompleted += completed;
  counterShow();
}


function counterShow() {
  allCount.innerHTML = countAll;
  pendingCount.innerHTML = countPending;
  completedCount.innerHTML = countCompleted
}

var pending = taskBox.getElementsByTagName("li");