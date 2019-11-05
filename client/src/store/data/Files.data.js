import { fetch } from './general.data';
export const getFiles = async (folder) => {
	try {
		const call = await fetch(`/api/files/${folder}`);
		const json = await call.json();
		return json.files;
	} catch (e) {
		throw e;
	}
};

export const classifyFile = async (folderVar, fileVar, taskVar, labelVar) => {
	try {
		await fetch(`/api/classify`, {
			method: 'POST',
			body: JSON.stringify({ folder: folderVar, file: fileVar, task: taskVar, label: labelVar }),
			headers: {
				'Content-type': 'application/json'
			}
		});
	} catch (e) {
		throw e;
	}
};
