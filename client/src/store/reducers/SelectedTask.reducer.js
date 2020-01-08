import * as actions from '../actions/Selected-Task.actions';

const initalState = { files: [] };

export function selectedTask(state = initalState, action) {
	switch (action.type) {
		case actions.SET_SELECTED_TASK_FILES:
			return {
				files: action.payload
			};
		default:
			return state;
	}
}
