// Seleciona os elementos do DOM
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("list");
const data = new Date(); // Para registrar a data de criação

// Elementos para os contadores
const countCreatedSpan = document.getElementById("contador-criadas");
const countCompletedSpan = document.getElementById("contador-concluido");
let countCreated = 0; // Variável para rastrear o número de tasks ativas (não concluídas)
let countCompleted = 0; // Variável para rastrear o número de tasks completadas

// Chaves para salvar os dados no LocalStorage
const saveCountCreated = `countCreated`;
const saveCountCompleted = `countCompleted`;
const tasksStorage = "tasks"; // Chave para salvar o array de tarefas

// -------------------------------------------- Funções para Salvar e Carregar Dados do LocalStorage ----------------------------------------------

// Função para salvar os contadores no LocalStorage
function saveCount() {
    localStorage.setItem(saveCountCreated, countCreated.toString());
    localStorage.setItem(saveCountCompleted, countCompleted.toString());
}

// Função para carregar os contadores do LocalStorage
function loadCount() {
    const loadedCreated = localStorage.getItem(saveCountCreated);
    const loadedCompleted = localStorage.getItem(saveCountCompleted);

    // Se houver dados no localStorage, carregue. se não, inicia em 0
    countCreated = loadedCreated ? parseInt(loadedCreated) : 0;
    countCompleted = loadedCompleted ? parseInt(loadedCompleted) : 0;

    // Atualiza a exibição inicial dos contadores
    countCreatedSpan.textContent = countCreated;
    countCompletedSpan.textContent = countCompleted;
}

// Função para salvar as tarefas no LocalStorage
function saveTasks(tasks) {
    localStorage.setItem(tasksStorage, JSON.stringify(tasks));
}

// Função para carregar as tarefas do LocalStorage
function loadTasks() {
    const storedTasks = localStorage.getItem(tasksStorage);
   
        return storedTasks ? JSON.parse(storedTasks) : [];  // Se houver tarefas salvas, retorna o array parseado, se não, um vazio
}

// Função para atualizar a exibição do contador de tarefas criadas
function updateCountCreated(valor) {
    countCreated += valor;

    // Garante que o contador não fique negativo
    if (countCreated < 0) {
        countCreated = 0;
    }
    countCreatedSpan.textContent = countCreated;
    saveCount(); // Salva o contador após a atualização
}

// Função para atualizar a exibição do contador de tarefas concluídas
function updateCountCompleted(valor) {
    countCompleted += valor;

    if (countCompleted < 0) {
        countCompleted = 0;
    }
    countCompletedSpan.textContent = countCompleted;
    saveCount(); 
}


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

    // Botão Editar
    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("edit-button");

    editButton.addEventListener("click", () => {
        const newTitle = prompt("Editar título:", title);
        const newDescription = prompt("Editar descrição:", description);

        // Verifica se o usuário não cancelou e se os campos não estão vazios
        if (newTitle !== null && newDescription !== null && newTitle.trim() !== "" && newDescription.trim() !== "") {
            const tasks = loadTasks();
            // Encontra a tarefa original e busca pela tarefa NÃO concluída.
            const taskIndex = tasks.findIndex(
                (task) => task.title === title && task.description === description && !task.completed
            );

            if (taskIndex !== -1) {
                tasks[taskIndex].title = newTitle.trim();
                tasks[taskIndex].description = newDescription.trim();
                saveTasks(tasks); 

                taskDetails.innerHTML = `
                    <h3 class="title">${newTitle.trim()}</h3>
                    <p class="description">${newDescription.trim()}</p>
                    <p class="date">Criado em: ${data.toLocaleDateString()}</p>
                `;

                // Atualiza as variáveis locais 'title' e 'description' para futuras operações (editar/concluir)
                title = newTitle.trim();
                description = newDescription.trim();
            }
        } else {
            alert("Edição cancelada ou campos inválidos!");
        }
    });

    // Botão Concluir
    const completeButton = document.createElement("button");
    completeButton.textContent = "Concluir";
    completeButton.classList.add("conclude-button");

    completeButton.addEventListener("click", () => {
        const tasks = loadTasks();

    //procura a tarefa não concluida
        const taskIndex = tasks.findIndex(
            (task) => task.title === title && task.description === description && !task.completed
        );

        if (taskIndex !== -1) {
            tasks[taskIndex].completed = true; // Marca a tarefa como concluída
            saveTasks(tasks); 

            taskItem.remove(); // Remove o elemento visual da tarefa da lista na tela

            updateCountCreated(-1); // Decrementa o contador de tarefas criadas
            updateCountCompleted(1); // Incrementa o contador de tarefas concluídas
        }
    });

    taskContent.appendChild(taskDetails);
    taskActions.appendChild(editButton);
    taskActions.appendChild(completeButton);
    taskContent.appendChild(taskActions);
    taskItem.appendChild(taskContent);

    return taskItem;
}

// Renderiza APENAS as tarefas não concluídas
function renderTasks() {
    const allTasks = loadTasks(); 
    const incompleteTasks = allTasks.filter(task => !task.completed);

    taskList.innerHTML = ""; // Limpa a lista na tela antes de renderizar

    // Adiciona à lista visual apenas as tarefas NÃO concluídas
    incompleteTasks.forEach(({ title, description }) => {
        const taskElement = createTaskElement(title, description);
        taskList.appendChild(taskElement);
    });

    // Recalcula o total de tarefas criadas (ativas) e concluídas
    const currentCreatedCount = incompleteTasks.length; // Tarefas ativas sendo exibidas
    const currentCompletedCount = allTasks.filter(task => task.completed).length; // Total de tarefas marcadas como concluídas (mesmo que não exibidas)

    // Atualiza as variáveis globais dos contadores
    countCreated = currentCreatedCount;
    countCompleted = currentCompletedCount;

    // Atualiza a exibição no DOM e salva no localStorage
    countCreatedSpan.textContent = countCreated;
    countCompletedSpan.textContent = countCompleted;
    saveCount();
}

// Evento de envio do formulário para adicionar nova tarefa
taskForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Impede o recarregamento da página ao enviar o formulário

    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (title && description) { // Se ambos os campos não estiverem vazios
        const tasks = loadTasks();
        tasks.push({ title, description, completed: false });
        saveTasks(tasks); // Salva o array atualizado no localStorage

        const taskElement = createTaskElement(title, description);
        taskList.appendChild(taskElement);

        updateCountCreated(1); // Incrementa o contador de tarefas criadas (ativas)

        taskForm.reset(); // Limpa os campos do formulário
    } else {
        alert("Por favor, preencha todos os campos!");
    }
});

// Carrega dados e renderiza tarefas assim que o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", () => {
    loadCount(); 
    renderTasks(); 
});