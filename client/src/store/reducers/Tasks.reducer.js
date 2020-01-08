import * as taskActions from '../actions/Tasks.actions';
export const initialState = [];

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
