const STORAGE_KEY = "todo_tasks";
// will work more on these later on
export function initStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
}

export function getTasks() {
  const tasks = localStorage.getItem(STORAGE_KEY);
  return tasks ? JSON.parse(tasks) : [];
}

export function saveTasks(tasksArray) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksArray));
}

export function addTaskToStorage(taskObj) {
  const currentTasks = getTasks();
  currentTasks.push(taskObj);
  saveTasks(currentTasks);
}
