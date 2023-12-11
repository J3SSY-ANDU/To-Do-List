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
    let date = new Date();
    date.setTime(date.getTime() + (7*24*60*60*1000));
    let task = document.createElement("li");
    let divTask = document.createElement("div");
    let checkbox = document.createElement("input");
    let label = document.createElement("label");
    let divInfo = document.createElement("div");
    let p = document.createElement("p");
    let dateStr = `12/10/2023`;

    task.className = "task";
    task.id = `new_task_${i}`;
    checkbox.type = "checkbox";
    checkbox.name, checkbox.className = "checkbox";
    label.for = "checkbox";
    p.className = "date";
    divTask.className = "divTask";
    divInfo.className = "divInfo";

    p.append(dateStr);
    label.append(val);
    divTask.append(checkbox);
    divInfo.append(label);
    divInfo.append(p);
    divTask.append(divInfo);
    task.append(divTask);
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
        let divTask = clickedTask.parentNode;
        let task = divTask.parentNode;
        let list = task.parentNode;

        let divInfo = divTask.querySelector("div");
        let opacity = 1;
        task.style.animation = "width 0.46s ease-out forwards";
        let interval = setInterval(() => {
            divInfo.style.backgroundColor = "#c0f2b085";
            opacity -= 0.1;
            task.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(interval);
                list.removeChild(task);
            }
        }, 40);

        t_complete++;
        setCookies("t_complete", t_complete, 7);
        setCookies(`completed_task_${t_complete}`, getCookie(task.id), 7);
        removeCookie(task.id);
    }
}

function removeTask(event) {
    const clickedTask = event.target;
    if (clickedTask.tagName === "LABEL") {
        let divInfo = clickedTask.parentNode;
        let divTask = divInfo.parentNode;
        let task = divTask.parentNode;
        let list = task.parentNode;

        let opacity = 1;
        divTask.style.animation = "height 0.46s ease-out forwards";
        let interval = setInterval(() => {
            divInfo.style.backgroundColor = "#FA707060";
            divInfo.style.textDecoration = "line-through";
            opacity -= 0.1;
            divTask.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(interval);
                list.removeChild(task);
            }
        }, 40);

        n_tasks--;
        setCookies("n_tasks", n_tasks, 7);
        removeCookie(task.id);
    }

    if (clickedTask.className === "divInfo") {
        let divTask = clickedTask.parentNode;
        let task = divTask.parentNode;
        let list = task.parentNode;

        let opacity = 1;
        divTask.style.animation = "height 0.46s ease-out forwards";
        let interval = setInterval(() => {
            clickedTask.style.backgroundColor = "#FA707060";
            clickedTask.style.textDecoration = "line-through";
            opacity -= 0.1;
            divTask.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(interval);
                list.removeChild(task);
            }
        }, 40);

        n_tasks--;
        setCookies("n_tasks", n_tasks, 7);
        removeCookie(task.id);
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

