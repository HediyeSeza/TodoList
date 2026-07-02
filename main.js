import { initSidebar } from "./src/components/sidebar.js";
import { initHeader } from "./src/components/header.js";
import { initTasks } from "./src/components/task.js";
import { initModal } from "./src/components/modal.js";

import { initStorage } from "./src/utils/storage.js";
import { initTheme } from "./src/utils/theme.js";

function initApp() {
  initStorage();
  initTheme();

  initSidebar();
  initHeader();
  initTasks();
  initModal();
}

initApp();