// import { initSidebar } from "./src/components/sidebar.js";
// import { initHeader } from "./src/components/header.js";
import { initTasks } from "./src/components/task.js";
import { initModal } from "./src/components/modal.js";

import { initStorage } from "./src/utils/storage.js";

function initApp() {
initStorage();

//   initSidebar();
//   initHeader();
initTasks();
initModal();
}

initApp();

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

//تاریخ//

function updateCurrentDate() {
  const today = new Date();

  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const parts = formatter.formatToParts(today);

  const weekday = parts.find((p) => p.type === "weekday")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const year = parts.find((p) => p.type === "year")?.value;

  const currentDate = `${weekday}، ${day} ${month} ${year}`;

  const desktopDate = document.getElementById("desktop-date");
  const mobileDate = document.getElementById("mobile-date");

  if (desktopDate) desktopDate.textContent = currentDate;
  if (mobileDate) mobileDate.textContent = currentDate;
}

updateCurrentDate();

//منو//

const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
const sidebar = document.getElementById("sidebar");


  function openSidebar() {
  sidebar.classList.remove("translate-x-full");
  overlay.classList.remove("hidden");
}
  

function closeSidebar() {
sidebar.classList.add("translate-x-full");
  overlay.classList.add("hidden");
}

menuBtn.addEventListener("click", openSidebar);

closeBtn.addEventListener("click", closeSidebar);

const overlay = document.getElementById("overlay");
overlay.addEventListener("click", closeSidebar);
