import { combineReducers } from  'redux';
import {userSettings} from './UserSettings.reducer';
import {tasks} from './Tasks.reducer';

const rootReducer = combineReducers({userSettings,tasks});

export default rootReducer;