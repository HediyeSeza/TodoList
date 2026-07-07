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

const darkBtn = document.getElementById("dark-btn");
const lightBtn = document.getElementById("light-btn");

darkBtn.addEventListener("click", () => {
  document.documentElement.classList.add("dark");
  localStorage.setItem("theme", "dark");
});

lightBtn.addEventListener("click", () => {
  document.documentElement.classList.remove("dark");
  localStorage.setItem("theme", "light");
});

if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
}
console.log("JS Loaded");
