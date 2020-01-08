import { combineReducers } from 'redux';
import { userSettings } from './UserSettings.reducer';
import { tasks } from './Tasks.reducer';
import { selectedTask } from './SelectedTask.reducer';

const rootReducer = combineReducers({ userSettings, tasks, selectedTask });

export default rootReducer;
