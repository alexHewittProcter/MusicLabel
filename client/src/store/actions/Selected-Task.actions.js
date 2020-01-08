export const SET_SELECTED_TASK_FILES = 'SET_SELECTED_TASK_FILES';

export function setSelectedTaskFiles(files) {
	return { type: SET_SELECTED_TASK_FILES, payload: files };
}
