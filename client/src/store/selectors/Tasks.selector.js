export const getTasks = (state) => state.tasks;
export const getTask = (state, id) => state.tasks[id];
export const getNextTaskId = (state) => state.tasks.length;
