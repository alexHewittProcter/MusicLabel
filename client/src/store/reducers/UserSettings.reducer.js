import * as fromUserSettings from '../actions/UserSettings.actions';

export const initialState = {
	name: '',
	setup: true
};

export function userSettings(state = initialState, action) {
	switch (action.type) {
		case fromUserSettings.SET_USER_SETTINGS:
			const payload = action.payload;
			return {
				...state,
				...payload
			};
		default:
			return state;
	}
}
