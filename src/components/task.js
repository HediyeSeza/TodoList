import { getTasks, saveTasks } from "../utils/storage.js";

// is our list empty or not?

export function checkEmptyState() {
  const emptyState = document.getElementById("no-tasks");
  const allTasks = getTasks();
  const activeTasks = allTasks.filter((task) => task.isCompleted === false);

  if (emptyState) {
    if (activeTasks.length === 0) {
      emptyState.classList.remove("hidden");
    } else {
      emptyState.classList.add("hidden");
    }
  }
}

function getPriorityStyles() {
  return {
    high: {
      label: "بالا",
      barClass: "bg-[#FF5F37]",
      tagBg: "bg-[#FFE2DB]",
      tagText: "text-[#FF5F37]",
    },
    medium: {
      label: "متوسط",
      barClass: "bg-[#FFAF37]",
      tagBg: "bg-[#FFEFD6]",
      tagText: "text-[#FFAF37]",
    },
    low: {
      label: "پایین",
      barClass: "bg-[#11A483]",
      tagBg: "bg-[#C3FFF1]",
      tagText: "text-[#11A483]",
    },
  };
}

// main task container
const tasksContainer = document.getElementById("active-tasks-list");
const completedTasksContainer = document.getElementById("completed-tasks-list");
const activeTasksStatus = document.getElementById("active-tasks-status");
const completedTasksStatusEls = document.querySelectorAll(".completed-tasks-status");

function updateActiveTasksStatus(count) {
  if (!activeTasksStatus) return;

  if (count === 0) {
    activeTasksStatus.textContent = "تسکی برای امروز نداری!";
  } else {
    activeTasksStatus.textContent = `${count} تسک را باید انجام بدهید`;
  }
}

function updateCompletedTasksStatus(count) {
  completedTasksStatusEls.forEach((statusEl) => {
    if (count === 0) {
      statusEl.textContent = "هیچ تسکی انجام نشده است.";
    } else {
      statusEl.textContent = `${count} تسک انجام شده است`;
    }
  });
}

export function initTasks() {
  renderTasks();
  window.refreshTasksList = renderTasks;
  window.refreshCompletedTasksList = renderCompletedTasks;
  setupCheckboxListeners();
}

function renderTasks() {
  if (!tasksContainer) return;

  // getting data from our local storage
  const allTasks = getTasks();
  const activeTasks = allTasks.filter((task) => task.isCompleted === false);

  // empty the container
  tasksContainer.innerHTML = "";
  checkEmptyState();

  const priorityStyles = getPriorityStyles();

  activeTasks.forEach((task) => {
    const style = priorityStyles[task.priority] || priorityStyles.low;

    const taskElement = document.createElement("div");
    taskElement.className =
      "task-card card-bg relative flex items-center justify-between w-[328px] md:w-[744px] max-w-full mx-auto min-h-[105px] rounded-[12px] px-[20px] py-[24px] mb-3 shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#091120] overflow-hidden";
    taskElement.dir = "rtl";

    taskElement.innerHTML = `
      <div class="absolute right-0 top-0 bottom-0 w-1 ${style.barClass} shrink-0"></div>

      <button type="button" data-id="${task.id}" class="task-menu-btn cursor-pointer absolute left-3 top-3 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none dark:hover:bg-[#112038] transition-colors">
        <img src="./assets/icons/Light/dots.svg" alt="options" class="w-5 h-5" />
      </button>

      <div class="task-menu hidden w-[78px] h-[34px] absolute left-6 top-14 z-10 flex items-center justify-center gap-[10px] rounded-[8px] border border-gray-200 bg-white p-[5px] shadow-lg dark:border-gray-700 dark:bg-[#091120]">
        <button type="button" data-id="${task.id}" class="task-delete-btn cursor-pointer flex h-[24px] w-[24px] items-center justify-center rounded-full text-red-500  focus:outline-none">
          <img src="./assets/icons/Light/tabler_trash-x.svg" alt="delete" class="w-4 h-4" />
        </button>
        <div class="w-px h-5 bg-[#EBEDEF]"></div>
      <button type="button" data-id="${task.id}" class="task-edit-btn cursor-pointer flex h-[24px] w-[24px] items-center justify-center rounded-full text-gray-700 dark:text-gray-200  focus:outline-none">
          <img src="./assets/icons/Light/tabler_edit.svg" alt="edit" class="w-4 h-4" />
        </button>
      </div>

      <div class="flex items-start gap-4 py-3 pr-4 h-full w-full">
        <div class="flex items-center justify-center shrink-0 mt-1">
          <input type="checkbox" data-id="${task.id}" class="task-checkbox w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer">
        </div>

        <div class="flex flex-col gap-1.5 w-full">
          <div class="flex items-center gap-2 min-w-0 max-w-full">
            <span class="min-w-0 text-[16px] font-bold text-gray-900 dark:text-white line-clamp-1 truncate">
              ${task.title}
            </span>

            <span class="px-[8px] py-[2px] rounded-[4px] text-[12px] font-semibold ${style.tagBg} ${style.tagText} shrink-0">
              ${style.label}
            </span>
          </div>

          ${task.desc ? `<p class="text-[14px] text-gray-500 dark:text-gray-400 line-clamp-2">${task.desc}</p>` : ""}
        </div>
      </div>
    `;

    tasksContainer.appendChild(taskElement);
  });

  updateActiveTasksStatus(activeTasks.length);
  renderCompletedTasks();

  const taskCountEl = document.getElementById("active-task-count");
  if (taskCountEl) {
    taskCountEl.textContent = activeTasks.length;
  }
}

function renderCompletedTasks() {
  if (!completedTasksContainer) return;

  const allTasks = getTasks();
  const completedTasks = allTasks.filter((task) => task.isCompleted === true);

  updateCompletedTasksStatus(completedTasks.length);

  completedTasksContainer.innerHTML = "";

  if (completedTasks.length === 0) {
    return;
  }

  const priorityStyles = getPriorityStyles();

  completedTasks.forEach((task) => {
    const style = priorityStyles[task.priority] || priorityStyles.low;

    const taskElement = document.createElement("div");
    taskElement.className =
      "task-card card-bg relative flex items-center justify-between w-[328px] md:w-[744px] max-w-full mx-auto min-h-[105px] rounded-[12px] px-[20px] py-[24px] mb-3 shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#091120] overflow-hidden opacity-90";
    taskElement.dir = "rtl";

    taskElement.innerHTML = `
      <div class="absolute right-0 top-0 bottom-0 w-1 ${style.barClass} shrink-0"></div>

      <div class="flex items-start gap-4 py-3 pr-4 h-full w-full">
        <div class="flex items-center justify-center shrink-0 mt-1">
          <label class="flex items-center justify-center cursor-pointer">
            <input type="checkbox" data-id="${task.id}" checked class="task-checkbox sr-only">
            <img src="./assets/icons/Light/tick-square.svg" alt="completed" class="w-5 h-5" />
          </label>
        </div>

        <div class="flex flex-col gap-1.5 w-full">
          <div class="flex items-center gap-2 min-w-0 max-w-full">
            <span class="min-w-0 text-[16px] font-bold text-gray-900 dark:text-white line-clamp-1 truncate line-through">
              ${task.title}
            </span>

            <span class="px-[8px] py-[2px] rounded-[4px] text-[12px] font-semibold ${style.tagBg} ${style.tagText} shrink-0">
              ${style.label}
            </span>
          </div>
        </div>
      </div>

      <div class="relative shrink-0 ml-2">
        <button type="button" data-id="${task.id}" class="task-menu-btn p-2 cursor-pointer rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none dark:hover:bg-[#112038] transition-colors">
          <img src="./assets/icons/Light/dots.svg" alt="options" class="w-5 h-5" />
        </button>

        <div class="task-menu hidden w-[78px] h-[34px] absolute left-3 top-8 z-10 flex items-center justify-center gap-[10px] rounded-[8px] border border-gray-200 bg-white p-[5px] shadow-lg dark:border-gray-700 dark:bg-[#091120]">
        <button type="button" data-id="${task.id}" class="task-delete-btn cursor-pointer flex h-[24px] w-[24px] items-center justify-center rounded-full text-red-500  focus:outline-none">
          <img src="./assets/icons/Light/tabler_trash-x.svg" alt="delete" class="w-4 h-4" />
        </button>
        <div class="w-px h-5 bg-[#EBEDEF]"></div>
      <button type="button" data-id="${task.id}" class="task-edit-btn cursor-pointer flex h-[24px] w-[24px] items-center justify-center rounded-full text-gray-700 dark:text-gray-200  focus:outline-none">
          <img src="./assets/icons/Light/tabler_edit.svg" alt="edit" class="w-4 h-4" />
        </button>
        
      </div>
      </div>
    `;

    completedTasksContainer.appendChild(taskElement);
  });
}

// check our task and move them to done
function setupCheckboxListeners() {
  if (!tasksContainer) return;

  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("task-checkbox")) {
      const taskId = Number(e.target.dataset.id);
      const allTasks = getTasks();

      const taskIndex = allTasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        allTasks[taskIndex].isCompleted = e.target.checked;
        saveTasks(allTasks);

        renderTasks();
      }
    }
  });

  document.addEventListener("click", (e) => {
    const menuButton = e.target.closest(".task-menu-btn");
    const deleteButton = e.target.closest(".task-delete-btn");
    const editButton = e.target.closest(".task-edit-btn");

    document.querySelectorAll(".task-menu").forEach((menu) => {
      if (!menu.contains(e.target) && !e.target.closest(".task-menu-btn")) {
        menu.classList.add("hidden");
      }
    });

    if (menuButton) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      const menu = menuButton.nextElementSibling;
      if (menu && menu.classList.contains("task-menu")) {
        menu.classList.toggle("hidden");
      }
    }

    if (deleteButton) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      const taskId = Number(deleteButton.dataset.id);
      const allTasks = getTasks();
      const updatedTasks = allTasks.filter((task) => task.id !== taskId);
      saveTasks(updatedTasks);
      renderTasks();
    }

    if (editButton) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      const taskId = Number(editButton.dataset.id);
      const taskCard = editButton.closest(".task-card") || editButton.closest(".card-bg");
      if (window.openTaskFormById) {
        window.openTaskFormById(taskId, taskCard);
      }
    }
  });
}
