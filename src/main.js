// html nodes and general variables
const input = document.getElementById("new-task");
const list = document.getElementById("task-list");
const btn = document.getElementById("btn");


// Data
const audio = new Audio("../data/pop.mp3");


// Cookie n value
let n = getCookie("n"); // cookie count


// Set cookie
function setCookies(cname, cvalue, exdays) {
    let date = new Date();
    date.setTime(date.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + date.toUTCString();
    cname = cname + "=";
    cvalue = cvalue + ";";
    document.cookie = cname + cvalue + expires + ";path=/src; " + "SameSite=None; " + "Secure;";
}


// Get cookie
function getCookie(cname) {
    let cookie = document.cookie;
    let tasksArray = cookie.split(";");
    for (let i = 0; i < tasksArray.length; i++) {
        let val = tasksArray[i];
        let valArray = val.trim().split("=");
        if (valArray[0] == cname) {
            return valArray[1];
        }
    }
    return "";
}


// Add task
function addTask() {
    if (input.value != "") {
        n++;
        setCookies("n", n, 1);
        setCookies(`task_${n}`, input.value, 1);

        let task = document.createElement("li");
        let checkBox = document.createElement("input");
        let label = document.createElement("label");
        task.className = "task";
        checkBox.type = "checkbox";
        checkBox.name, checkBox.id = "checkBox";
        label.for = "checkBox";
        audio.volume = 1;
        audio.play();
        label.append(input.value);
        task.append(checkBox);
        task.append(label);
        list.append(task);
        input.value = "";
    }
}


// Remove Task
function removeTask(event) {
    const clickedTask = event.target;
    if (clickedTask.tagName === "INPUT") {
        let parent = clickedTask.parentNode;
        let list = parent.parentNode;
        list.removeChild(parent);
    }
}


// Button events
btn.addEventListener("click", addTask);
input.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        addTask();
    }
});


// Checkbox event
list.addEventListener("change", removeTask);
