import { addTaskToStorage, getTasks, saveTasks } from "../utils/storage.js";

let editTaskId = null;

export function initModal() {
  const showFormBtn = document.getElementById("show-form-btn");
  const inlineTaskForm = document.getElementById("inline-task-form");
  const cancelTaskBtn = document.getElementById("cancel-task-btn");
  const emptyState = document.getElementById("no-tasks");

  // دکمه
  const tagBtn = document.getElementById("tags-dropdown-btn");
  const tagsMenu = document.getElementById("tags-menu");
  const tagIcon = document.getElementById("tag-icon");

  // المان‌های فرم
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-desc");
  const addBtn = document.getElementById("add-task-btn");
  const priorityBtns = document.querySelectorAll(".priority-btn");
  // priorities
  const priorityContainer = document.getElementById("tags-menu");
  const selectedDisplay = document.getElementById("selected-priority-display");
  const selectedText = document.getElementById("selected-text");
  const removeBtn = document.getElementById("remove-priority-btn");
  let finalPriority = null;

  let selectedPriority = null;

  if (!showFormBtn || !inlineTaskForm) return;

  const defaultFormParent = inlineTaskForm.parentElement;
  const defaultFormNextSibling = inlineTaskForm.nextElementSibling;
  let currentTaskCard = null;

  // open form
  if (showFormBtn) {
    showFormBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      currentTaskCard = null;
      resetFormMode();
      openForm(null, true);
    });
  }

  document.addEventListener("click", (e) => {
    if (
      !inlineTaskForm.classList.contains("hidden") &&
      !inlineTaskForm.contains(e.target) &&
      e.target !== showFormBtn &&
      !showFormBtn.contains(e.target) &&
      !e.target.closest(".task-menu") &&
      !e.target.closest(".task-menu-btn") &&
      !e.target.closest(".task-edit-btn") &&
      !e.target.closest(".task-delete-btn")
    ) {
      closeForm();
    }
  });

  const defaultPriorityBtn = document.querySelector('[data-priority="low"]');

  function updateAddButtonState() {
    const hasTitle = titleInput.value.trim().length > 0;
    const isEditMode = editTaskId !== null;

    if (isEditMode || hasTitle) {
      addBtn.classList.remove("opacity-60");
      addBtn.classList.add("opacity-100");
    } else {
      addBtn.classList.add("opacity-60");
      addBtn.classList.remove("opacity-100");
    }
  }

  function setPriorityDisplay(type) {
    selectedPriority = type;
    if (type === "high") {
      selectedDisplay.className =
        "flex items-center gap-[6px] px-[8px] py-[4px] h-[30px] bg-[#FFE2DB] text-[#FF5F37] rounded-[4px] font-semibold text-[12px] w-fit";
      selectedText.innerText = "بالا";
    } else if (type === "medium") {
      selectedDisplay.className =
        "flex items-center gap-[6px] px-[8px] py-[4px] h-[30px] bg-[#FFEFD6] text-[#FFAF37] rounded-[4px] font-semibold text-[12px] w-fit";
      selectedText.innerText = "متوسط";
    } else if (type === "low") {
      selectedDisplay.className =
        "flex items-center gap-[6px] px-[8px] py-[4px] h-[30px] bg-[#C3FFF1] text-[#11A483] rounded-[4px] font-semibold text-[12px] w-fit";
      selectedText.innerText = "پایین";
    }
    selectedDisplay.classList.remove("hidden");
    tagBtn.classList.add("hidden");
  }

  function openForm(taskCard = null, hideShowButton = true) {
    if (taskCard) {
      currentTaskCard = taskCard;
      taskCard.insertAdjacentElement("afterend", inlineTaskForm);
    } else if (defaultFormParent) {
      currentTaskCard = null;
      defaultFormParent.insertBefore(inlineTaskForm, defaultFormNextSibling);
    }

    if (showFormBtn && hideShowButton) {
      showFormBtn.classList.add("hidden");
      showFormBtn.classList.remove("flex");
    }

    inlineTaskForm.classList.remove("hidden");
    inlineTaskForm.classList.add("flex");

    if (emptyState) emptyState.classList.add("hidden");
    updateAddButtonState();
  }

  function resetFormMode() {
    editTaskId = null;
    currentTaskCard = null;
    selectedPriority = null;
    addBtn.textContent = "اضافه کردن تسک";
    selectedDisplay.classList.add("hidden");
    tagBtn.classList.remove("hidden");
    updateAddButtonState();
  }

  function closeForm() {
    inlineTaskForm.classList.add("hidden");
    inlineTaskForm.classList.remove("flex");

    if (showFormBtn) {
      showFormBtn.classList.remove("hidden");
      showFormBtn.classList.add("flex");
    }

    titleInput.value = "";
    descInput.value = "";
    resetFormMode();

    if (defaultFormParent) {
      defaultFormParent.insertBefore(inlineTaskForm, defaultFormNextSibling);
    }
  }

  if (cancelTaskBtn) {
    cancelTaskBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeForm();
    });
  }

  const openEditForm = (taskId, taskCard = null) => {
    resetFormMode();

    const tasks = getTasks();
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    editTaskId = taskId;
    titleInput.value = task.title;
    descInput.value = task.desc || "";
    selectedPriority = task.priority || "low";
    setPriorityDisplay(selectedPriority);
    addBtn.textContent = "ویرایش تسک";

    openForm(taskCard, false);
  };

  window.openTaskFormById = openEditForm;

  // closing and opening our menu
  tagBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const isMenuHidden = tagsMenu.classList.contains("hidden");

    tagsMenu.classList.toggle("hidden");

    // icon change
    tagIcon.src = isMenuHidden
      ? "./assets/icons/Light/tag-right-fill.svg"
      : "./assets/icons/Light/tag-right.svg";
  });

  document.querySelectorAll(".priority-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      const selected = e.target.dataset.priority;
      console.log("Priority selected:", selected);

      tagsMenu.classList.add("hidden");
      tagIcon.src = "./assets/icons/Light/tag-right.svg";
    });
  });

  // priority selection
  document.querySelectorAll(".priority-option").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const type = e.target.dataset.priority; // high, medium, low
      tagsMenu.classList.add("hidden");
      setPriorityDisplay(type);
      selectedPriority = type;
    });
  });

  // change priority
  removeBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    // back to default
    selectedPriority = null;

    selectedDisplay.classList.add("hidden");

    tagBtn.classList.remove("hidden");
    updateAddButtonState();
  });

  // task adding

  if (addBtn) {
    titleInput.addEventListener("input", updateAddButtonState);
    descInput.addEventListener("input", updateAddButtonState);

    addBtn.addEventListener("click", () => {
      const title = titleInput.value.trim();
      const desc = descInput.value.trim();

      if (!title) {
        alert("لطفاً نام تسک را وارد کنید.");
        return;
      }

      if (editTaskId !== null) {
        const tasks = getTasks();
        const taskIndex = tasks.findIndex((item) => item.id === editTaskId);
        if (taskIndex !== -1) {
          tasks[taskIndex] = {
            ...tasks[taskIndex],
            title,
            desc,
            priority: selectedPriority,
          };
          saveTasks(tasks);
        }
      } else {
        const newTask = {
          id: Date.now(),
          title: title,
          desc: desc,
          priority: selectedPriority || "low",
          isCompleted: false,
        };

        addTaskToStorage(newTask);
      }

      // form --> to its initial state
      closeForm();

      if (window.refreshTasksList) {
        window.refreshTasksList();
      }
    });
  }
}
