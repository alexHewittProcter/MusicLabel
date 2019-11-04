import fetch from 'node-fetch';
import * as generalData from './general.data';

export const setUserSettings = async (userSettings) => {
	try {
		setUserSettingsStorage(userSettings);
		const call = await setUserSettingsApi(userSettings);
		return call;
	} catch (e) {
		throw e;
	}
};

export const setUserSettingsStorage = (userSettings) => {
	//Set in local storage
	localStorage.setItem('userSettings', JSON.stringify(userSettings));
};

export const setUserSettingsApi = async (userSettings) => {
	//Set in API
	try {
		const call = await fetch('/api/userinfo', {
			method: 'POST',
			body: JSON.stringify(userSettings),
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

export const getUserSettingsStorage = () => {
	//Get from local storage
	return generalData.getObjectFromLocal('userSettings');
};

export const getUserSettingsApi = async () => {
	try {
		const call = await fetch('/api/userinfo');
		const json = await call.json();
		return json;
	} catch (e) {
		throw e;
	}
};
