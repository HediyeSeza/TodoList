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

  // debug

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
