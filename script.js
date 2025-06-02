//Seleciona os elementos do DOM
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("list");
const data = new Date();

//Elementos para os contadores
const countCreatedSpan = document.getElementById("contador-criadas"); //Span para exibir o número de tasks criadas
const countCompletedSpan = document.getElementById("contador-concluido"); //Span para exibir o número de tasks criadas
let countCreated = 0; //Variavel para rastrear o numero de tasks criadas
let countCompleted = 0; //Variavel para rastrear o numero de tasks completadas

//Elementos para salvar os contadores no LocalStorage
const saveCountCreated = `countCreated`;
const saveCountCompleted = `countCompleted`;

//Função para salvar os contadores
const saveCount = () => {
  localStorage.setItem(saveCountCreated, countCreated.toString());
  localStorage.setItem(saveCountCompleted, countCompleted.toString());
};

//Função para carregar os contadores
const loadCount = () => {
  const loadCreated = localStorage.getItem(saveCountCreated);
  const loadCompleted = localStorage.getItem(saveCountCompleted);

    if (loadCreated) {
      countCreated = parseInt(loadCreated);
    };

    if (loadCompleted) {
      countCompleted = parseInt(loadCompleted);
    };
    updateCountCreated(0);
    updateCountCompleted(0);
};

//função para atualizar a exibição do contador de tarefas criadas
const updateCountCreated = (valor) => {
  countCreated += valor;
    countCreatedSpan.textContent = countCreated; //Atualiza o texto do span com o novo valor do contador
      saveCount();
};

//Função para atualizar a exibição do contador de tarefas concluidas
const updateCountCompleted = (valor) => {
  countCompleted += valor;
    countCompletedSpan.textContent = countCompleted; // Atualiza o texto do span com o novo valor do contador
      saveCount();
};

//Função para salvar tarefas no LocalStorage
const SaveTasks = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks)); //Converte o array de tarefas para string JSON e salva no localStorage com a chave "tasks"
};

//Função para carregar tarefas do LocalStorage
const LoadTasks = () => {
  const storedTasks = localStorage.getItem("tasks");// Obtem a string JSON das tarefas do localStorage com a chave "tasks"
    return storedTasks ? JSON.parse(storedTasks) : [];//Se existir, converte de volta para array, senão, retorna um array vazio 
};

//Cria um elemento de tarefa (item da lista)
const creatTaskElement = (title, description) => {
  const taskItem = document.createElement("li"); //Cria um elemento "li" para a tarefa
        taskItem.classList.add("task-item"); //Adiciona a classe "task-item" ppara aplicar estilos visuais

  const taskContent = document.createElement("div"); //Cria uma "div" para conter o conteudo principal da tarefa
        taskContent.classList.add("card"); //Cria uma "div" para os detalhes da tarefa (titulos e descrição)
};

const taskDetails = document.createElement("div"); //cria uma "div" para os detalhes da tarefa (titulo e descrição)
      taskDetails.innerHTML = `
      <h3 class="title">${title}</h3>
      <p class="description">${description}</p>
      <p class="date">Criado em: ${data.toLocaleDateString()}</p>
      `;// Define o HTML interno com titulo, descrição e data de criação formatada

const taskActions = document.createElement("div");// Cria uma "div" para conter os botões de ação (Editar e concluir)
      taskActions.classList.add("actions");// Adiciona a classe "actions" para aplicar estilos aos botões

//cria um elemento de edição de tarefas 
const editButton = document.createElement("button");// Cria um botão de edição
      editButton.textContent = "Editar";
      editButton.classList.add("edit-button");

      //Adiciona um ouvinte de evento de clique para editar a tarefa
      editButton.addEventListener("click", () => {
        const newTitle = prompt("Editar titulo:", title); //Abre uma caixa de dialogo
        const newDescription = prompt("Editar descrição:", description);

          if (newTitle && newDescription) {
            const tasks = loadTasks(); //Carrega a lista de tarefas atual do localStorage
            const taskIndex = tasks.findIndex (  // Encontra o índice da tarefa que está sendo editada na lista carregada
                  (task) => task.title === title && task.description === description
                  );
          
          if (taskIndex !== -1) {
            tasks[taskIndex].title = newTitle.trim();// Atualiza o titulo da tarefa no array carregado
            tasks[taskIndex].description = newDescription.trim();
              SaveTasks(tasks);// Salva a lista de tarefas atualizadas no localStorage
          };

          title = newTitle.trim();// Atualiza o titulo exibido no elemento HTML
          description = newDescription.trim();
            taskDetails.innerHTML = `
            <h3 class="title">${title}</h3>
            <p class="description">${description}</p>
            <p class="date">Criado em: ${data.toLocaleDateString()}</p>
            `;// Atualiza o HTML interno dos detalhes da tarefa com os novos valores
        } else {
          alert("Edição cancelada ou campos invalidos!");// Exibe um alerta se o usuario cancelar a edição ou inserir campos vazios
        };
      });

const completed = document.createElement("button");//Cria um botão de concluir par marcaar a tarefa como feita
      completed.textContent = "Concluir";
      completed.classList.add("conclude-button");

      //Adiciona um ouvinte de evento de clique para marcar a tarefa a classe concluir para alterar a aparencia visual
      completed.addEventListener("click", () => {
        taskItem.classList.toggle("concluir");
        updateCountCompleted(taskItem.classList.contains("concluir") ? 1 : -1); // Atualiza o contador de tarefas concluídas: incrementa se a classe "concluir" for adicionada, decrementa se removida
      
        //Atualiza o estado de conclusão no LocalStorage
      const tasks = loadTasks();
      const taskIndex = tasks.findIndex(
        (task) => task.title !== title || task.description !== description
      );
          tasks[taskIndex].completed = taskItem.classList.contains("completed");
            SaveTasks(tasks);
              taskItem.remove();
      

taskcontent.appendChild(taskDetails);// Adiciona a div de detalhes ao conteudo da tarefa
taskActions.appendChild(editButton);// Adiciona o botão de editar a div de ação
taskActions.appendChild(completed);// Adiciona o botão de concluir a div de ação
taskContent.appendChild(taskActions);// Adiciona a div de ações ao conteudo da tarefa
taskItem.appendChild(taskContent);// Adiciona o conteudo completo ao item da tarefa
      return taskItem;// Retorna o elemento "li" da tarefa created
});

//Renderiza todas as tarefas carregadas do localStorage
const renderTasks = () => {
  const tasks = loadTasks();
        taskList.innerHTML = ""; //Limpa o conteudo atual da liista na pagina
          countCreated = 0;// Reseta o contador
          countCompleted = 0;
        
        tasks.forEach(({title, description, completed}) => { //para cada tarefa na lista carregada
          const taskElement = createTaskElement(title, description); //cria o elementoo HTML da tarefa
            if (completed)  {
              taskElement.classList.add("completed");
                countCompleted++; //Incrementa o contador de tarefas concluidas
            };
              taskList.appendChild(taskElement);
                countCreated++ //Incrementa o contador de tarefas criadas
        
                updateCountCreated(0);//Atualiza a exibição com a contagem da renderização
                updateCountCompleted(0);
        });
};

//Evento de envo do formulario para adicionar nova tarefa
taskForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Impede o comportamento padrão de envio do formulário (recarregar a página)
    const title = taskForm.title.value.trim();
    const description = taskForm.description.value.trim();

      if (title && description) {
        const task = loadtasks();
        tasks.push({title, description, completed: false});
          SaveTasks(tasks);

          const taskElement = createTaskElement(title, description);
                taskList.appendChild(taskElement);
                  updateCountCreated(1);

                  taskForm.reset();
      }else {
        alert("Por favor, preencha todos os campos!");
      };
});

// Carrega e renderiza as tarefas assim que o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", () => {
  loadContador();
  renderTasks();
});