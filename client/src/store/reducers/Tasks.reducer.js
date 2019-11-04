import * as taskActions from '../actions/Tasks.actions';
// import * as taskModels from "../models/Tasks.models";
export const initialState = [];
// const firstTask = new taskModels.Task();
// firstTask.name = "TEst";
// firstTask.folder = "TEST";
// firstTask.labels.push("First");
// firstTask.labels.push("Second");
// initialState.push(firstTask);

export function tasks(state = initialState, action) {
	switch (action.type) {
		case taskActions.ADD_TASK:
			const oldTasks = [ ...state ];
			oldTasks.push(action.payload);
			return oldTasks;
		case taskActions.UPDATE_TASK:
			const tasksArray = [ ...state ];
			tasksArray[action.payload.index] = action.payload.task;
			return tasksArray;
		case taskActions.SET_TASKS:
			return action.payload;
		default:
			return state;
	}
}
