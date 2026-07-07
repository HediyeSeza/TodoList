import { addTaskToStorage } from "../utils/storage.js";

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

  let selectedPriority = "low";

  if (!showFormBtn || !inlineTaskForm) return;

  // open form
  if (showFormBtn) {
    showFormBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      showFormBtn.classList.add("hidden");
      showFormBtn.classList.remove("flex");

      inlineTaskForm.classList.remove("hidden");
      inlineTaskForm.classList.add("flex");

      if (emptyState) emptyState.classList.add("hidden");
    });
  }

  // close form
  document.addEventListener("click", (e) => {
    const isFormOpen = !inlineTaskForm.classList.contains("hidden");
    const clickedOutside =
      !inlineTaskForm.contains(e.target) && !showFormBtn.contains(e.target);

    if (isFormOpen && clickedOutside) {
      closeForm();
    }
  });
  // close and show the first box again
  const closeForm = () => {
    inlineTaskForm.classList.add("hidden");
    inlineTaskForm.classList.remove("flex");

    showFormBtn.classList.remove("hidden");
    showFormBtn.classList.add("flex");

    titleInput.value = "";
    descInput.value = "";
  };

  const defaultPriorityBtn = document.querySelector('[data-priority="low"]');
  if (defaultPriorityBtn) defaultPriorityBtn.click();

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
      tagBtn.classList.add("hidden");
      tagsMenu.classList.add("hidden");
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

      selectedPriority = type;
    });
  });

  // change priority
  removeBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    // back to default
    selectedPriority = "low";

    selectedDisplay.classList.add("hidden");

    tagBtn.classList.remove("hidden");
  });

  // task adding

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      console.log("دکمه اضافه کردن تسک کلیک شد!");
      const title = titleInput.value.trim();
      const desc = descInput.value.trim();

      if (!title) {
        alert("لطفاً نام تسک را وارد کنید.");
        return;
      }

      const newTask = {
        id: Date.now(),
        title: title,
        desc: desc,
        priority: selectedPriority,
        isCompleted: false,
      };

      // save in storage
      addTaskToStorage(newTask);

      // form --> to its initial state
      closeForm();

      // reseting our priority
      if (defaultPriorityBtn) defaultPriorityBtn.click();

      if (window.refreshTasksList) {
        window.refreshTasksList();
      }
    });
  }
}
