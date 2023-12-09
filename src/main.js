// html nodes and general variables
const input = document.getElementById("new-task");
const list = document.getElementById("task-list");
const btn = document.getElementById("btn");


// Data
const audio = new Audio("../data/pop.mp3");
audio.volume = 1;

// Cookie n value
let n_tasks = getCookie("n_tasks"); // cookie count
let t_complete = getCookie("t_complete");


// Set cookie
function setCookies(cname, cvalue, exdays) {
    let date = new Date();
    date.setTime(date.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + date.toUTCString();
    cname = cname + "=";
    cvalue = cvalue + ";";
    document.cookie = cname + cvalue + expires + ";path=/; " + "SameSite=None; " + "Secure;";
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


// Removes Cookie
function removeCookie(cname) {
    let date = new Date();
    cname = cname + "=";
    let cvalue = getCookie(cname) + ";";
    date.setTime(date.getTime() - (1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = cname + cvalue + expires + ";path=/; " + "SameSite=None; " + "Secure;";
}


// Print Cookies
function printCookies() {
    if (document.cookie.length != 0) {
        let cookieArray = document.cookie.split(";");
        for (let cookie of cookieArray) {
            let task = cookie.trim().split("=");
            if (task[0].startsWith("new_task")) {
                let cvalue = getCookie(task[0]);
                let i = task[0].split("_").at(2);
                addToList(cvalue, i);
            }
        }
    }
}


// Add task to list
function addToList(val, i) {
    let task = document.createElement("li");
    let checkBox = document.createElement("input");
    let label = document.createElement("label");
    task.className = "task";
    task.id = `new_task_${i}`;
    checkBox.type = "checkbox";
    checkBox.name, checkBox.className = "checkBox";
    label.for = "checkBox";
    label.append(val);
    task.append(checkBox);
    task.append(label);
    list.append(task);
}


// Add task
function addTask() {
    if (input.value != "") {
        n_tasks++;
        setCookies("n_tasks", n_tasks, 7);
        setCookies(`new_task_${n_tasks}`, input.value, 7);

        audio.play();
        
        addToList(input.value, n_tasks);
        input.value = "";
    }
}


// Mark completed tasks
function checkTask(event) {
    const clickedTask = event.target;
    if (clickedTask.tagName === "INPUT") {
        let parent = clickedTask.parentNode;
        let list = parent.parentNode;
        list.removeChild(parent);

        t_complete++;
        setCookies("t_complete", t_complete, 7);
        setCookies(`completed_task_${t_complete}`, getCookie(parent.id), 7);
        removeCookie(parent.id);
    }
}

function removeTask(event) {
    const clickedTask = event.target;
    if (clickedTask.tagName === "LABEL") {
        let parent = clickedTask.parentNode;
        let list = parent.parentNode;
        list.removeChild(parent);

        n_tasks--;
        setCookies("n_tasks", n_tasks, 7);
        removeCookie(parent.id);
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
list.addEventListener("change", checkTask);


// Label event
list.addEventListener("click", removeTask);


// Read cookies and add them to the list
printCookies()

