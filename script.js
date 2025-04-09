let editingIndex = null;

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {

        if (tasks.length > 0) {

}

        const li = document.createElement('li');

        if (editingIndex === index) {
            const editTextArea = document.createElement('textarea');
            editTextArea.value = task.text; 
            editTextArea.classList.add('edit-input');
            editTextArea.focus();
            editTextArea.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && event.shiftKey) {
                    event.preventDefault();
                    saveTask(index, editTextArea.value);
                }
            });

            li.appendChild(editTextArea);

            const saveButton = document.createElement('button');
            saveButton.classList.add('save');
            const updateIcon = document.createElement('i');
            updateIcon.classList.add('fas', 'fa-sync-alt');
            saveButton.appendChild(updateIcon);
            saveButton.onclick = () => saveTask(index, editTextArea.value);
            li.appendChild(saveButton);
        } else {
            const taskTextContainer = document.createElement('div');
            taskTextContainer.classList.add('task-text');
            
            // Substituir as quebras de linha por <br> para exibir corretamente no HTML
            taskTextContainer.innerHTML = task.text.replace(/\n/g, '<br>'); 

            if (task.completed) {
                li.classList.add('completed');
            }

            const completeButton = document.createElement('button');
            const completeIcon = document.createElement('i');
            completeIcon.classList.add('fas', task.completed ? 'fa-times' : 'fa-check');
            completeButton.appendChild(completeIcon);
            completeButton.classList.add('complete');
            completeButton.onclick = () => toggleCompletion(index);

            const deleteButton = document.createElement('button');
            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fas', 'fa-trash');
            deleteButton.appendChild(deleteIcon);
            deleteButton.classList.add('remove');
            deleteButton.onclick = () => deleteTask(index);

            const editButton = document.createElement('button');
            const editIcon = document.createElement('i');
            editIcon.classList.add('fas', 'fa-edit');
            editButton.appendChild(editIcon);
            editButton.classList.add('edit');
            editButton.onclick = () => editTask(index);

            li.appendChild(taskTextContainer);
            li.appendChild(completeButton);
            li.appendChild(editButton);
            li.appendChild(deleteButton);
        }
if ("Notification" in window && Notification.permission === "granted") {
    const pendingTasks = tasks.filter(task => !task.completed);
    if (pendingTasks.length > 0) {
        const notification = new Notification("Você tem tarefas pendentes!", {
            body: `Total de pendentes: ${pendingTasks.length}`,
            icon: "/icon.png" // opcional: coloque o caminho de um ícone legal
        });
    }
}

        taskList.appendChild(li);
    });
}


function editTask(index) {
    document.getElementById('loadingSpinner').style.display = 'flex';
    editingIndex = index;

    setTimeout(() => {
        loadTasks();
        document.getElementById('loadingSpinner').style.display = 'none';
    }, 400);
}


function saveTask(index, newText) {
    document.getElementById('loadingSpinner').style.display = 'flex'; 
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (newText.trim() !== '') {
        tasks[index].text = newText;
    }
    editingIndex = null;

    localStorage.setItem('tasks', JSON.stringify(tasks));

    setTimeout(() => {
        loadTasks();
        document.getElementById('loadingSpinner').style.display = 'none'; 
    }, 500);
}
function addTask() {
    const taskInput = document.getElementById('taskInput');
    if (!taskInput) {
        alert('Campo de input não encontrado!');
        return;
    }

    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        document.getElementById('loadingSpinner').style.display = 'flex';

        try {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

            const newTask = {
                text: taskText,
                completed: false
            };
            tasks.push(newTask);

            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = '';
        } catch (e) {
            console.error("Erro ao adicionar tarefa:", e);
            alert("Erro ao salvar a tarefa. Verifique se o armazenamento está disponível.");
        }

        setTimeout(() => {
            try {
                loadTasks();
            } catch (e) {
                console.error("Erro ao carregar tarefas:", e);
            } finally {
                document.getElementById('loadingSpinner').style.display = 'none';
            }
        }, 500);
    }
}


function deleteTask(index) {
    document.getElementById('loadingSpinner').style.display = 'flex';

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    setTimeout(() => {
        loadTasks();
        document.getElementById('loadingSpinner').style.display = 'none'; 
    }, 500);
}

function toggleCompletion(index) {
    document.getElementById('loadingSpinner').style.display = 'flex';

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks[index].completed = !tasks[index].completed;

    localStorage.setItem('tasks', JSON.stringify(tasks));

    setTimeout(() => {
        loadTasks();
        document.getElementById('loadingSpinner').style.display = 'none';   
    }, 500);
}

function toggleTheme() {
    const body = document.body;
    const container = document.querySelector('.container');

    body.classList.toggle('dark-theme');
    container.classList.toggle('dark-theme');

    if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}


window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.querySelector('.container').classList.add('dark-theme');
    }
});




document.getElementById('taskInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTask();
    }
});



function showNotification(message, duration = 4000) {
    const container = document.getElementById('notification-container') || createNotificationContainer();

    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    container.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, duration);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.position = 'fixed';
    container.style.top = '1rem';
    container.style.right = '1rem';
    container.style.zIndex = 9999;
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    document.body.appendChild(container);
    return container;
}


window.onload = () => {
    // Aplica tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme'); 
        document.querySelector('.container').classList.add('dark-theme');
    }

    // Testa se o localStorage está funcional
    try {
        localStorage.setItem('test', 'ok');
        if (localStorage.getItem('test') !== 'ok') {
            alert("LocalStorage parece não estar funcionando.");
        }
    } catch (e) {
        alert("Erro com localStorage: " + e.message);
    }

    // Carrega as tarefas
    loadTasks();

    // Solicita permissão de notificação
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // Inicia notificação periódica
    setInterval(notifyPendingTasks, 30000);
};




// Função para verificar tarefas pendentes e notificar
function notifyPendingTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const pendingTasks = tasks.filter(task => !task.completed);

    if (
        "Notification" in window &&
        Notification.permission === "granted" &&
        pendingTasks.length > 0
    ) {
        new Notification("Você ainda tem tarefas pendentes!", {
            body: `Total: ${pendingTasks.length}`,
            icon: "/icon.png" // opcional
        });
    }
}
setInterval(() => {
    notifyPendingTasks();
}, 30000); 
