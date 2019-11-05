import { fetch } from './general.data';
import * as generalData from './general.data';

export const setTasks = async (tasks) => {
	try {
		const call = await setTasksApi(tasks);
		setTasksStorage(tasks);
		return call;
	} catch (e) {
		throw e;
	}
};

export const setTasksStorage = (tasks) => {
	//Set tasks in local storage
	localStorage.setItem('tasks', JSON.stringify({ tasks: tasks }));
};

export const setTasksApi = async (tasks) => {
	//Set in API
	try {
		const call = await fetch('/api/tasks', {
			method: 'POST',
			body: JSON.stringify({ tasks: tasks }),
			headers: {
				'Content-type': 'application/json'
			}
		});
		const json = await call.json();
		return json;
	} catch (e) {
		throw e;
	}
};

export const getTasksStorage = () => {
	//Get tasks from local storage
	const tasks = generalData.getObjectFromLocal('tasks');
	return Object.keys(tasks).length > 0 ? tasks.tasks : [];
};

export const getTasksApi = async () => {
	//Get tasks from api
	try {
		const call = await fetch('/api/tasks');
		const json = await call.json();
		if (Object.keys(json).length > 0) {
			return json.tasks;
		} else {
			return [];
		}
	} catch (e) {
		throw e;
	}
};
