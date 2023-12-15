// html nodes and general variables
const input = document.getElementById("new-task");
const list = document.getElementById("task-list");
const btn = document.getElementById("btn");
const eyeIcon = document.getElementById("eyeIcon");

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
function printCookies(str) {
    if (document.cookie.length != 0) {
        let cookieArray = document.cookie.split(";");
        for (let cookie of cookieArray) {
            let task = cookie.trim().split("=");
            if (task[0].startsWith(str)) {
                let cvalue = getCookie(task[0]);
                let taskNameArray = task[0].split("_");
                let i = taskNameArray.at(2);
                let cname = taskNameArray[0] + "_" + taskNameArray[1] + "_";
                addToList(cname, cvalue, i);
            }
        }
    }
}


// Add task to list
function addToList(name, val, i) {
    let date = new Date();
    date.setTime(date.getTime() + (7*24*60*60*1000));
    let task = document.createElement("li");
    let divInput = document.createElement("div");
    let divTask = document.createElement("div");
    let checkbox = document.createElement("input");
    let label = document.createElement("label");
    let divInfo = document.createElement("div");
    let div_3 = document.createElement("div");
    let span = document.createElement("span");
    let icon = document.createElement("i");

    let p = document.createElement("p");
    let expires = date.toLocaleDateString() + "\t|\t" + date.toLocaleTimeString();
    console.log(expires);

    task.className = "task";
    task.id = name + i;
    checkbox.type = "checkbox"; checkbox.title = "Marks task as completed";
    checkbox.name, checkbox.className = "checkbox";
    label.for = "checkbox";
    div_3.className = "div_3";
    p.className = "date";
    divTask.className = "divTask";
    if (name.startsWith("completed")) {
        divInfo.className = "divInfo divInfo-completed"; divInfo.id = "divInfo";
        icon.className = "fa-solid fa-trash-can-arrow-up"; span.title = 'Move to "New Tasks"';
        checkbox.checked = true;
        checkbox.disabled = true;
    } else {
        icon.className = "fa-regular fa-trash-can"; span.title = "Removes task";
        divInfo.className = "divInfo"; 
    }

    label.append(val);
    console.log(val);
    label.textContent = val.charAt(0).toUpperCase() + val.slice(1);

    p.append(expires);
    divInput.append(checkbox);
    divTask.append(divInput);
    divInfo.append(label);
    span.append(icon);
    div_3.append(p);
    div_3.append(span);
    divInfo.append(div_3);
    divTask.append(divInfo);
    task.append(divTask);
    list.append(task);
}


// Add task
function addTask() {
    if (input.value != "") {
        n_tasks++;
        let cname = "new_task_";
        setCookies("n_tasks", n_tasks, 7);
        setCookies(cname + n_tasks, input.value, 7);

        audio.play();
        
        addToList(cname, input.value, n_tasks);
        input.value = "";
    }
}

let click = true;
function editTask(event) {
    let clickedTask = event.target;
    let divInfo = clickedTask.parentNode;
    let divTask = divInfo.parentNode;
    let task = divTask.parentNode;
    if (clickedTask.tagName == "LABEL" && task.id.startsWith("new_task")) {
        if (click) {
            let range = document.createRange();
            range.selectNodeContents(clickedTask);
            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            click = false;
        }
        clickedTask.contentEditable = true;
        clickedTask.focus();
        
        clickedTask.addEventListener("blur", () => {
            clickedTask.contentEditable = false;
            click = true;
            setCookies(task.id, clickedTask.textContent, 7);
        })
        clickedTask.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && clickedTask.textContent != "") {
                e.preventDefault();
                clickedTask.contentEditable = false;
                clickedTask.blur();
                click = true;
            }
        });
    }
}


// Mark completed tasks
function checkTask(event) {
    const clickedTask = event.target;
    if (clickedTask.tagName === "INPUT" && clickedTask.parentNode.parentNode.parentNode.id.startsWith("new_task")) {
        let divInput = clickedTask.parentNode;
        let divTask = divInput.parentNode;
        let task = divTask.parentNode;
        let list = task.parentNode;

        let divInfo = divTask.querySelector("div:nth-child(2)");
        let opacity = 1;
        task.style.animation = "height 0.33s ease-out forwards";
        let interval = setInterval(() => {
            divInfo.style.backgroundColor = "#c0f2b085";
            opacity -= 0.1;
            task.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(interval);
                list.removeChild(task);
            }
        }, 30);

        if (task.id.startsWith("new_task")) {
            t_complete++;
            n_tasks--;
            setCookies("n_tasks", n_tasks, 7);
            setCookies("t_complete", t_complete, 7);
            setCookies(`completed_task_${t_complete}`, getCookie(task.id), 7);
            removeCookie(task.id);
        }
    }
}

function removeTask(event) {
    const clickedTask = event.target;
    let span = clickedTask.parentNode;
    let div_3 = span.parentNode;
    let divInfo = div_3.parentNode;
    let divTask = divInfo.parentNode;
    let task = divTask.parentNode;
    let list = task.parentNode;
    console.log(clickedTask);
    if (clickedTask.tagName == "I") {
        let opacity = 1;
        divTask.style.animation = "width 0.33s ease-out forwards";
        let interval = setInterval(() => {
            divInfo.style.backgroundColor = "#FA707060";
            opacity -= 0.1;
            divTask.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(interval);
                list.removeChild(task);
            }
        }, 30);

        if (task.id.startsWith("new_task")) {
            n_tasks--;
            setCookies("n_tasks", n_tasks, 7);
            removeCookie(task.id);
        } else {
            t_complete--;
            n_tasks++;
            let cname = "new_task_";
            setCookies("n_tasks", n_tasks, 7);
            setCookies("t_complete", t_complete, 7);
            setCookies(cname + n_tasks, getCookie(task.id), 7);
            addToList(cname, getCookie(task.id), n_tasks);
            removeCookie(task.id);
        }
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


let iconChange = true;
eyeIcon.addEventListener("click", () => {
    if (iconChange) {
        iconChange = !iconChange;
        eyeIcon.className = "fa-regular fa-eye fa-sm";
        eyeIcon.title = "Visible Mode";
        printCookies("completed");
    }
    else {
        iconChange = !iconChange;
        eyeIcon.className = "fa-regular fa-eye-slash fa-sm";
        eyeIcon.title = "Hide Mode";
        let children = Array.from(list.children);
        for (let child of children) {
            if (child.id.startsWith("completed")) {
                list.removeChild(child);
            }
        }
    }
})

list.addEventListener("click", editTask);


// Read cookies and add them to the list
printCookies("new_task");

