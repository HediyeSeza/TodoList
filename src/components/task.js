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
      tagClasses:
        "bg-[#FFE2DB] text-[#FF5F37] dark:bg-[#3D2327] dark:text-[#FF5F37]",
    },
    medium: {
      label: "متوسط",
      barClass: "bg-[#FFAF37]",
      tagClasses:
        "bg-[#FFEFD6] text-[#FFAF37] dark:bg-[#302F2D] dark:text-[#FFAF37]",
    },
    low: {
      label: "پایین",
      barClass: "bg-[#11A483]",
      tagClasses:
        "bg-[#C3FFF1] text-[#11A483] dark:bg-[#233332] dark:text-[#11A483]",
    },
  };
}

function getPriorityWeight(priority) {
  switch (priority) {
    case "high":
      return 0;
    case "medium":
      return 1;
    case "low":
      return 2;
    default:
      return 3;
  }
}

function sortActiveTasks(tasks) {
  return [...tasks].sort(
    (a, b) => getPriorityWeight(a.priority) - getPriorityWeight(b.priority),
  );
}

// main task container
const tasksContainer = document.getElementById("active-tasks-list");
const completedTasksContainer = document.getElementById("completed-tasks-list");
const activeTasksStatus = document.getElementById("active-tasks-status");
const completedTasksStatusEls = document.querySelectorAll(
  ".completed-tasks-status",
);

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
  const activeTasks = sortActiveTasks(
    allTasks.filter((task) => task.isCompleted === false),
  );

  // empty the container
  tasksContainer.innerHTML = "";
  checkEmptyState();

  const priorityStyles = getPriorityStyles();

  activeTasks.forEach((task) => {
    const style = priorityStyles[task.priority] || priorityStyles.low;

    const taskElement = document.createElement("div");
    taskElement.className =
      "task-card card-bg relative flex items-start justify-between w-full md:w-[744px] max-w-full mx-auto rounded-[12px] px-[20px] py-[12px] mb-3 shadow-sm border border-gray-100 dark:border-gray-800 bg-white card-bg overflow-visible";
    taskElement.dir = "rtl";

    taskElement.innerHTML = `
      <div class="absolute right-0 top-0 h-full w-1 flex flex-col py-3">
        <div class="flex-1 rounded-l-full ${style.barClass}"></div>
      </div>

      <div class="absolute left-3 top-3">
        <div class="relative inline-block">
          <button type="button" data-id="${task.id}" class="task-menu-btn cursor-pointer p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none dark:hover:bg-[#112038] transition-colors">
            <img src="./assets/icons/Light/dots.svg" alt="options" class="block w-5 h-5 dark:hidden" />
            <img src="./assets/icons/Dark/dots.svg" alt="options" class="hidden w-5 h-5 dark:block" />
          </button>

          <div class="task-menu border-10 hidden w-[78px] h-[34px] absolute top-7 mt-1 left-14 -translate-x-1/2 z-20 items-center justify-center gap-[10px] rounded-[8px] border border-gray-200 bg-white p-[5px] shadow-lg dark:border-gray-700 card-bg">
            <button type="button" data-id="${task.id}" class="task-delete-btn cursor-pointer flex h-[24px] w-[24px] items-center justify-center rounded-full text-red-500  focus:outline-none">
              <img src="./assets/icons/Light/tabler_trash-x.svg" alt="delete" class="w-6 h-6" />
            </button>
            <div class="w-px h-5 bg-[#EBEDEF]"></div>
            <button type="button" data-id="${task.id}" class="task-edit-btn cursor-pointer flex h-[24px] w-[24px] items-center justify-center rounded-full text-gray-700 dark:text-gray-200  focus:outline-none">
              <img src="./assets/icons/Light/tabler_edit.svg" alt="edit" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-start gap-3 w-full py-3">
        <div class="flex items-start justify-center shrink-0 mt-0 mr-3">
          <label class="relative flex items-center cursor-pointer">
            <input type="checkbox" data-id="${task.id}" class="sr-only peer task-checkbox">
    
            <div class="w-5 h-5 rounded-[5px] border border-[#B8B8B8] dark:border-[#CCCCCC] bg-white dark:bg-[#091120] flex items-center justify-center transition-colors duration-150">
      
              <svg class="w-3.5 h-3.5 text-white hidden peer-checked:block" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
           </label>
        </div>

        <div class="flex flex-col gap-2 w-full text-right">
          <div class="flex flex-col md:flex-row md:items-start items-start gap-1 md:gap-2 w-full">
            <span class="min-w-0 text-[16px] font-bold text-gray-900 dark:text-white truncate text-right">
              ${task.title}
            </span>

            <span class="inline-flex shrink-0 items-center justify-center rounded-[4px] px-[8px] py-[2px] text-[12px] font-semibold ${style.tagClasses} md:mt-0!">
              ${style.label}
            </span>
          </div>

          <p class="text-[14px] text-caption dark:text-gray-400 text-right break-words w-full">
            ${task.desc || "توضیحی اضافه نشده است"}
          </p>
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
      "task-card card-bg relative flex items-start justify-between w-full md:w-[744px] max-w-full mx-auto rounded-[12px] px-[20px] py-[16px] mb-3 shadow-sm border border-gray-100 dark:border-gray-800 bg-white card-bg overflow-visible opacity-90";
    taskElement.dir = "rtl";

    taskElement.innerHTML = `
      <div class="absolute right-0 top-0 h-full w-1 flex flex-col py-3">
        <div class="flex-1 rounded-l-full ${style.barClass}"></div>
      </div>

      <div class="flex items-start gap-4 py-1 w-full mr-3">
        <div class="flex items-start justify-center shrink-0 mt-1">
          <label class="flex items-center justify-center cursor-pointer">
            <input type="checkbox" data-id="${task.id}" checked class="task-checkbox sr-only">
            <img src="./assets/icons/Light/tick-square.svg" alt="completed" class="w-6 h-6" />
          </label>
        </div>

        <div class="flex flex-col gap-0 w-full text-right">
          <div class="flex flex-col md:flex-row md:items-start pt-1 items-start gap-1 md:gap-2 w-full">
            <span class="min-w-0 text-[16px] font-bold text-gray-900 dark:text-white line-through truncate text-right">
              ${task.title}
            </span>

            <span class="inline-flex shrink-0 items-center justify-center rounded-[4px] px-[6px] py-[2px] text-[12px] font-semibold ${style.tagClasses} md:mt-0!">
              ${style.label}
            </span>
          </div>
        </div>
      </div>

      <div class="relative shrink-0 ml-2 right-3">
        <div class="relative inline-block">
          <button type="button" data-id="${task.id}" class="task-menu-btn p-2 cursor-pointer rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none dark:hover:bg-[#112038] transition-colors">
            <img src="./assets/icons/Light/dots.svg" alt="options" class="block w-5 h-5 dark:hidden" />
            <img src="./assets/icons/Dark/dots.svg" alt="options" class="hidden w-5 h-5 dark:block" />
          </button>

          <div class="task-menu hidden w-[78px] h-[34px] absolute top-7 mt-1 left-14 -translate-x-1/2 z-20 items-center justify-center gap-[10px] rounded-[8px] border border-gray-200 bg-white p-[5px] shadow-lg dark:border-gray-700 card-bg">
            <button type="button" data-id="${task.id}" class="task-delete-btn cursor-pointer flex h-[24px] w-[24px] items-center justify-center rounded-full text-red-500  focus:outline-none">
              <img src="./assets/icons/Light/tabler_trash-x.svg" alt="delete" class="w-6 h-6" />
            </button>
            <div class="w-px h-5 bg-[#EBEDEF]"></div>
            <button type="button" data-id="${task.id}" class="task-edit-btn cursor-pointer flex h-[24px] w-[24px] items-center justify-center rounded-full text-gray-700 dark:text-gray-200  focus:outline-none">
              <img src="./assets/icons/Light/tabler_edit.svg" alt="edit" class="w-6 h-6" />
            </button>
          </div>
        </div>
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
        menu.classList.remove("flex");
      }
    });

    if (menuButton) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      const menu = menuButton.nextElementSibling;
      if (menu && menu.classList.contains("task-menu")) {
        menu.classList.toggle("hidden");
        menu.classList.toggle("flex");
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
      const taskCard =
        editButton.closest(".task-card") || editButton.closest(".card-bg");
      if (window.openTaskFormById) {
        window.openTaskFormById(taskId, taskCard);
      }
    }
  });
}
