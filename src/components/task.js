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

// main task container
const tasksContainer = document.getElementById("active-tasks-list");

export function initTasks() {
  renderTasks();
  window.refreshTasksList = renderTasks;
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

  const priorityStyles = {
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

  // ۳. رندر کردن تسک‌ها با ساختار HTML جدید
  activeTasks.forEach((task) => {
    // اگر اولویتی ست نشده بود، به صورت پیش‌فرض روی پایین قرار بده
    const style = priorityStyles[task.priority] || priorityStyles.low;

    const taskElement = document.createElement("div");
    // استفاده از relative و overflow-hidden برای نوار رنگی سمت راست
    taskElement.className =
      "card-bg relative flex items-center justify-between w-full max-w-2xl min-h-[72px] rounded-2xl pl-4 pr-0 mb-3 shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#091120] overflow-hidden";
    taskElement.dir = "rtl";

    taskElement.innerHTML = `
      <div class="absolute right-0 top-0 bottom-0 w-1 ${style.barClass} shrink-0"></div>

      <div class="flex items-start gap-4 py-3 pr-4 h-full w-full">
        
        <div class="flex items-center justify-center shrink-0 mt-1">
          <input type="checkbox" data-id="${task.id}" class="task-checkbox w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer">
        </div>

        <div class="flex flex-col gap-1.5 w-full">
          <div class="flex items-center justify-between w-full">
             <span class="text-[16px] font-bold text-gray-900 dark:text-white line-clamp-1">
               ${task.title}
             </span>
             
             <span class="px-[8px] py-[2px] rounded-[4px] text-[12px] font-semibold ${style.tagBg} ${style.tagText} ml-2 shrink-0">
               ${style.label}
             </span>
          </div>
          
          ${task.desc ? `<p class="text-[14px] text-gray-500 dark:text-gray-400 line-clamp-2">${task.desc}</p>` : ""}
        </div>
      </div>

      <button class="text-gray-400 hover:text-gray-600 focus:outline-none p-2 shrink-0 ml-2">
        <img src="./assets/icons/Light/dots.svg" alt="options" class="w-5 h-5" />
      </button>
    `;

    tasksContainer.appendChild(taskElement);
  });

  // updating the task number
  const taskCountEl = document.getElementById("active-task-count");
  if (taskCountEl) {
    taskCountEl.textContent = activeTasks.length;
  }
}

// check our task and move them to done
function setupCheckboxListeners() {
  if (!tasksContainer) return;

  tasksContainer.addEventListener("change", (e) => {
    if (e.target.classList.contains("task-checkbox")) {
      const taskId = Number(e.target.dataset.id);
      const allTasks = getTasks();

      const taskIndex = allTasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        allTasks[taskIndex].isCompleted = true;
        saveTasks(allTasks);

        // refreshing our task list
        renderTasks();

        if (window.refreshCompletedTasksList) {
          window.refreshCompletedTasksList();
        }
      }
    }
  });
}
