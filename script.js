//Seleciona os elementos do DOM
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("list");
const data = new Date();

//Elementos para os contadores
const countCreatedSpan = document.getElementById("contador-criadas");
const countCompletedSpan = document.getElementById("contador-concluido");
let countCreated = 0;
let countCompleted = 0;

//Elementos para salvar os contadores no LocalStorage
const saveCountCreated = `countCreated`;
const saveCountCompleted = `countCompleted`;

//Função para salvar os contadores
function saveCount() {
    localStorage.setItem(saveCountCreated, countCreated.toString());
    localStorage.setItem(saveCountCompleted, countCompleted.toString());
}

//Função para carregar os contadores
function loadCount() {
    const loadCreated = localStorage.getItem(saveCountCreated);
    const loadCompleted = localStorage.getItem(saveCountCompleted);

    if (loadCreated) {
        countCreated = parseInt(loadCreated);
    }

    if (loadCompleted) {
        countCompleted = parseInt(loadCompleted);
    }
    // updateCountCreated(0); // Inicializa a exibição ao carregar
    // updateCountCompleted(0);
}

//função para atualizar a exibição do contador de tarefas criadas
function updateCountCreated(valor) {
    countCreated += valor;
    countCreatedSpan.textContent = countCreated;
    saveCount();
}

//Função para atualizar a exibição do contador de tarefas concluidas
function updateCountCompleted(valor) {
    countCompleted += valor;
    countCompletedSpan.textContent = countCompleted;
    saveCount();
}

//Função para salvar tarefas no LocalStorage
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Função para carregar tarefas do LocalStorage
function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
}

//Cria um elemento de tarefa (item da lista)
function createTaskElement(title, description) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");

    const taskContent = document.createElement("div");
    taskContent.classList.add("card");

    const taskDetails = document.createElement("div");
    taskDetails.innerHTML = `
        <h3 class="title">${title}</h3>
        <p class="description">${description}</p>
        <p class="date">Criado em: ${data.toLocaleDateString()}</p>
    `;

    const taskActions = document.createElement("div");
    taskActions.classList.add("actions");

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("edit-button");

    editButton.addEventListener("click", () => {
        const newTitle = prompt("Editar titulo:", title);
        const newDescription = prompt("Editar descrição:", description);

        if (newTitle && newDescription) {
            const tasks = loadTasks();
            const taskIndex = tasks.findIndex(
                (task) => task.title === title && task.description === description
            );

            if (taskIndex !== -1) {
                tasks[taskIndex].title = newTitle.trim();
                tasks[taskIndex].description = newDescription.trim();
                saveTasks(tasks);
            }

            taskDetails.innerHTML = `
                <h3 class="title">${newTitle.trim()}</h3>
                <p class="description">${newDescription.trim()}</h3>
                <p class="date">Criado em: ${data.toLocaleDateString()}</p>
            `;
        } else {
            alert("Edição cancelada ou campos invalidos!");
        }
    });

    const completed = document.createElement("button");
    completed.textContent = "Concluir";
    completed.classList.add("conclude-button");

    completed.addEventListener("click", () => {
        taskItem.classList.toggle("concluir");
        const isCompleted = taskItem.classList.contains("concluir");
        updateCountCompleted(isCompleted ? 1 : -1);
        updateCountCreated(-1); // Decrementa o contador de criadas ao concluir

        const tasks = loadTasks();
        const taskIndex = tasks.findIndex(
            (task) => task.title === title && task.description === description
        );
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = isCompleted;
            saveTasks(tasks);
            taskItem.remove(); // Remove a tarefa da lista visual
        }
    });

    taskContent.appendChild(taskDetails);
    taskActions.appendChild(editButton);
    taskActions.appendChild(completed);
    taskContent.appendChild(taskActions);
    taskItem.appendChild(taskContent);

    return taskItem;
}

//Renderiza todas as tarefas carregadas do localStorage
function renderTasks() {
    const tasks = loadTasks();
    taskList.innerHTML = "";
    countCreated = 0;
    countCompleted = 0;

    tasks.forEach(({ title, description, completed }) => {
        const taskElement = createTaskElement(title, description);
        if (completed) {
            taskElement.classList.add("completed");
            countCompleted++;
        }
        taskList.appendChild(taskElement);
        countCreated++;
    });
  
    updateCountCreated(countCreated); // Atualiza a contagem total APÓS renderizar
    updateCountCompleted(countCompleted);
}

//Evento de envio do formulario para adicionar nova tarefa
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = taskForm.title.value.trim();
    const description = taskForm.description.value.trim();

    if (title && description) {
        const task = loadTasks();
        task.push({ title, description, completed: false });
        saveTasks(task);

        const taskElement = createTaskElement(title, description);
        taskList.appendChild(taskElement);
        updateCountCreated(1);

        taskForm.reset();
    } else {
        alert("Por favor, preencha todos os campos!");
    }
});

// Carrega e renderiza as tarefas assim que o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", () => {
    loadCount();
    renderTasks();
});