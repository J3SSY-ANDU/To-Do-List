const input = document.getElementById("new-task");
const list = document.getElementById("task-list");
const btn = document.getElementById("btn");

const audio = new Audio("../data/pop.mp3");

function addTask() {
    if (input.value != "") {
        let task = document.createElement("li");
        let checkBox = document.createElement("input");
        let label = document.createElement("label");
        audio.volume = 1;
        audio.play();
        task.className = "task";
        checkBox.type = "checkbox";
        checkBox.name, checkBox.id = "checkBox";
        label.for = "checkBox";
        label.append(input.value);
        task.append(checkBox);
        task.append(label);
        list.append(task);
        input.value = "";
    }
}

function removeTask(event) {
    
    const clickedTask = event.target;
    if (clickedTask.tagName === "INPUT") {
        console.log(clickedTask.tagName);
        let parent = clickedTask.parentNode;
        let list = parent.parentNode;
        list.removeChild(parent);
    }
}


btn.addEventListener("click", addTask);
input.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        addTask();
    }
});

list.addEventListener("change", removeTask);
