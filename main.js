const input = document.getElementById("new-task");
const list = document.getElementById("task-list");
const btn = document.getElementById("btn");

function addTask() {
    if (input.value != "") {
        let task = document.createElement("li");
        task.className = "task";
        task.append(input.value);
        list.append(task);
        input.value = "";
    }
}

function removeTask(event) {
    const clickedTask = event.target;
    if (clickedTask.tagName === "LI") {
        list.removeChild(clickedTask);
    }
}


btn.addEventListener("click", addTask);
input.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        addTask();
    }
});

list.addEventListener("click", removeTask);
