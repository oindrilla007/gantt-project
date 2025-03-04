document.addEventListener("DOMContentLoaded", function () {
    const addTaskBtn = document.getElementById("addTaskBtn");
    const modal = document.getElementById("taskModal");
    const closeModal = document.querySelector(".close");
    const saveTaskBtn = document.getElementById("saveTaskBtn");
    const taskList = document.getElementById("taskList");
    const ganttHeader = document.getElementById("ganttHeader");
    const ganttBody = document.getElementById("ganttBody");

    // Open task modal
    addTaskBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Close task modal
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Save task
    saveTaskBtn.addEventListener("click", async () => {
        const name = document.getElementById("taskName").value;
        const assignee = document.getElementById("taskAssignee").value;
        const priority = document.getElementById("taskPriority").value;
        const deadline = document.getElementById("taskDeadline").value;

        const response = await fetch("/add_task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, assignee, priority, deadline }),
        });

        const data = await response.json();
        addTaskToList(data.task);
        modal.style.display = "none";
    });

    // Load tasks
    async function loadTasks() {
        const response = await fetch("/get_tasks");
        const tasks = await response.json();
        tasks.forEach(addTaskToList);
    }

    function addTaskToList(task) {
        const li = document.createElement("li");
        li.textContent = task.name;
        li.classList.add("task");
        li.draggable = true;
        li.dataset.id = task.id;
        li.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("taskId", task.id);
        });
        taskList.appendChild(li);
    }

    function setupGantt() {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        for (let i = 4; i <= 13; i++) {
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("day");
            dayDiv.textContent = `${days[i % 7]} ${i}`;
            dayDiv.dataset.day = i;
            dayDiv.addEventListener("dragover", (event) => event.preventDefault());
            dayDiv.addEventListener("drop", async (event) => {
                const taskId = event.dataTransfer.getData("taskId");
                await fetch("/update_task", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: parseInt(taskId), days: [i] }),
                });
            });
            ganttHeader.appendChild(dayDiv);
        }
    }

    loadTasks();
    setupGantt();
});
