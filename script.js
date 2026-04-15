/* =========================
CONTROL DE PESTAÑAS
========================= */

const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.section');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {

        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');

    });
});


/* =========================
BASE DE DATOS LOCAL (localStorage)
========================= */

let tasks = [];

// 🔹 Cargar tareas guardadas
const savedTasks = localStorage.getItem('tasks');

if (savedTasks) {
    tasks = JSON.parse(savedTasks);

    // 🔹 Convertir fecha de texto a Date
    tasks = tasks.map(t => ({
        ...t,
        time: new Date(t.time)
    }));
}


/* =========================
REFERENCIAS
========================= */

const taskNameInput = document.getElementById('taskName');
const taskDescInput = document.getElementById('taskDesc');
const addTaskBtn = document.getElementById('addTaskBtn');
const loading = document.getElementById('loading');

const pendingList = document.getElementById('pendingList');
const completedList = document.getElementById('completedList');


/* =========================
ACTUALIZAR LISTAS
========================= */

function updateTasks() {

    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    const now = new Date();

    tasks.forEach((task, index) => {

        const div = document.createElement('div');

        div.className = 'task-item' + (task.completed ? ' completed' : '');

        const diff = Math.floor((now - task.time) / 1000);

        let timeText = '';
        if (diff < 60) {
            timeText = 'Hace unos segundos';
        } else if (diff < 3600) {
            timeText = `Hace ${Math.floor(diff / 60)} min`;
        } else {
            timeText = `Hace ${Math.floor(diff / 3600)} h`;
        }

        div.innerHTML = `
            <div class="task-info">
                <strong>${task.name}</strong>
                <p>${task.desc}</p>

                ${!task.completed ? `<div class="task-time">${timeText}</div>` : ''}

            </div>

            <div class="task-buttons">

                ${!task.completed 
                    ? `<button class="btn-complete" data-index="${index}">Completar</button>` 
                    : ''}

                <button class="btn-delete" data-index="${index}">Eliminar</button>

            </div>
        `;

        if (task.completed) {
            completedList.appendChild(div);
        } else {
            pendingList.appendChild(div);
        }

    });

    /* 🔹 GUARDAR EN LOCALSTORAGE */
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


/* =========================
EVENTOS (OPTIMIZADO)
========================= */

document.addEventListener('click', (e) => {

    //  Completar tarea
    if (e.target.classList.contains('btn-complete')) {
        const i = e.target.dataset.index;
        tasks[i].completed = true;
        updateTasks();
    }

    //  Eliminar tarea
    if (e.target.classList.contains('btn-delete')) {
        const i = e.target.dataset.index;

        if (confirm('¿Eliminar esta tarea?')) {
            tasks.splice(i, 1);
            updateTasks();
        }
    }

});


/* =========================
AGREGAR TAREA
========================= */

addTaskBtn.addEventListener('click', () => {

    const name = taskNameInput.value.trim();
    const desc = taskDescInput.value.trim();

    if (!name || !desc) {
        alert('Completa todos los campos');
        return;
    }

    loading.style.display = 'block';

    setTimeout(() => {

        tasks.push({
            name,
            desc,
            completed: false,
            time: new Date()
        });

        taskNameInput.value = '';
        taskDescInput.value = '';

        loading.style.display = 'none';

        updateTasks();

    }, 800);
});


/* =========================
ACTUALIZAR TIEMPO
========================= */

setInterval(updateTasks, 60000);


/* =========================
INICIALIZAR APP
========================= */

updateTasks();
