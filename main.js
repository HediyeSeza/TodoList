// import { initSidebar } from "./src/components/sidebar.js";
// import { initHeader } from "./src/components/header.js";
// import { initTasks } from "./src/components/task.js";
// import { initModal } from "./src/components/modal.js";

// import { initStorage } from "./src/utils/storage.js";

// function initApp() {
//   initStorage();

//   initSidebar();
//   initHeader();
//   initTasks();
//   initModal();
// }

// initApp();

const lightBtn = document.getElementById("light-btn");
const darkBtn = document.getElementById("dark-btn");

function setTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");

    darkBtn.classList.add("active");
    lightBtn.classList.remove("active");
  } else {
    document.documentElement.classList.remove("dark");

    lightBtn.classList.add("active");
    darkBtn.classList.remove("active");
  }

  localStorage.setItem("theme", theme);
}

lightBtn.addEventListener("click", () => setTheme("light"));
darkBtn.addEventListener("click", () => setTheme("dark"));

setTheme(localStorage.getItem("theme") || "light");