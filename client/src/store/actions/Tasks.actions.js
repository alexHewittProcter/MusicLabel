export const ADD_TASK = 'ADD_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const SET_TASKS = 'SET_TASKS';

export function addTask(task) {
	return {
		type: ADD_TASK,
		payload: task
	};
}

export function updateTask(task, index) {
	return {
		type: UPDATE_TASK,
		payload: { task: task, index: index }
	};
}

export function setTasks(tasks) {
	return {
		type: SET_TASKS,
		payload: tasks
	};
}
