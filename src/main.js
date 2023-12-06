const input = document.getElementById("new-task");
const list = document.getElementById("task-list");
const btn = document.getElementById("btn");

const audio = new Audio("../data/pop.mp3");

function setCookies(cname, cvalue) {
    cname = cname + "=";
    cvalue = cvalue + "; ";
    document.cookie = cname + cvalue;
}

let cookieCount = 0;
let cookie = document.cookie;
console.log(cookie.search("n"));
cookie.search("n") >= 0 ? setCookies("n", parseInt(cookie.at(cookie.search("n")+2))) : setCookies("n", cookieCount);
function addTask() {
    if (input.value != "") {
        // let date = new Date();
        let cookie = document.cookie;
        let task_count = parseInt(cookie.at(cookie.search("n")+2));
        setCookies("n", parseInt(cookie.at(cookie.search("n")+2))+1);
        setCookies(`task_${++task_count}`, input.value);

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

function removeTask(event) {
    const clickedTask = event.target;
    if (clickedTask.tagName === "INPUT") {
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
