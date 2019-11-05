import nodeFetch from 'node-fetch';

export const getObjectFromLocal = (name) => {
	const objectString = localStorage.getItem(name);
	if (objectString === null) {
		return {};
	} else {
		return JSON.parse(objectString);
	}
};

export const fetch = (url, options) => {
	let call;
	if (options === undefined) {
		call = nodeFetch(url);
	} else {
		call = nodeFetch(url, options);
	}
	return call.then((res) => {
		if (!res.ok) {
			throw new Error('Something went wrong');
		} else {
			return res;
		}
	});
};
