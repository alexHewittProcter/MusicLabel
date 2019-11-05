const express = require('express');
const bodyParser = require('body-parser');
const mm = require('music-metadata');
const fs = require('fs');
const asyncFs = fs.promises;
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// When run check if user_files exist
(() => {
	fs.exists('./user_files', (result) => {
		if (!result) {
			fs.mkdir('./user_files', (err) => {
				console.log(err);
			});
		}
	});
	fs.exists('./input_files', (result) => {
		if (!result) {
			fs.mkdir('./input_files', (err) => {
				console.log(err);
			});
		}
	});
	fs.exists('./output_files', (result) => {
		if (!result) {
			fs.mkdir('./output_files', (err) => {
				console.log(err);
			});
		}
	});
})();

const getUserInfo = async () => {
	return await asyncFs
		.readFile('user_files/settings.json')
		.catch((err) => console.log(err))
		.then((data) => (data === undefined ? {} : data));
};

const getTasks = async () => {
	return await asyncFs
		.readFile('user_files/tasks.json')
		.catch((err) => console.log(err))
		.then((data) => (data === undefined ? {} : data));
};

const getInputFolders = async () => {
	return await asyncFs
		.readdir('input_files')
		.catch((err) => console.log(err))
		.then((data) => (data === undefined ? [] : data));
};

// Endpoints
app.get('/api/userinfo', async (req, res) => {
	try {
		const userInfo = await getUserInfo();
		res.setHeader('content-type', 'application/json');
		res.statusCode = 200;
		res.send(userInfo);
	} catch (e) {
		console.log(e);
		res.setHeader('content-type', 'application/json');
		res.statusCode = 500;
		res.send('Internal server error:500');
	}
});
app.post('/api/userinfo', async (req, res) => {
	//Save settings then send back
	try {
		await asyncFs.writeFile('user_files/settings.json', JSON.stringify(req.body)).catch((err) => console.log(err));
		res.send(req.body);
		res.statusCode = 200;
		res.end();
	} catch (e) {
		console.log(e);
		res.setHeader('content-type', 'application/json');
		res.statusCode = 500;
		res.send('Internal server error:500');
	}
});

app.get('/api/tasks', async (req, res) => {
	try {
		const tasks = await getTasks();
		res.setHeader('content-type', 'application/json');
		res.statusCode = 200;
		res.send(tasks);
	} catch (e) {
		console.log(e);
		res.setHeader('content-type', 'application/json');
		res.statusCode = 500;
		res.send('Internal server error:500');
	}
});

app.post('/api/tasks', async (req, res) => {
	//Save settings then send back
	try {
		await asyncFs.writeFile('user_files/tasks.json', JSON.stringify(req.body)).catch((err) => console.log(err));
		res.send(req.body);
		res.statusCode = 200;
		res.end();
	} catch (e) {
		console.log(e);
		res.setHeader('content-type', 'application/json');
		res.statusCode = 500;
		res.send('Internal server error:500');
	}
});

app.get('/api/inputfolders', async (req, res) => {
	try {
		const folders = await getInputFolders();
		res.setHeader('content-type', 'application/json');
		res.statusCode = 200;
		res.send(folders);
	} catch (e) {
		console.log(e);
		res.setHeader('content-type', 'application/json');
		res.statusCode = 500;
		res.send('Internal server error:500');
	}
});

//Returns first 20 from folder
app.get('/api/files/:folder', async (req, res) => {
	const { folder } = req.params;
	//read folder
	try {
		const files = await asyncFs.readdir('input_files/' + folder);
		let calls = await Promise.all(files.map((file) => mm.parseFile('input_files/' + folder + '/' + file)));
		calls = calls.slice(0, 20);
		calls = calls.map((call, index) => ({
			title: call.common.title,
			artists: call.common.artists,
			fileName: files[index]
		}));
		if (calls.length === 0) {
			calls = [];
		}
		res.setHeader('content-type', 'application/json');
		res.statusCode = 200;
		res.send({ files: calls });
	} catch (e) {
		console.log(e);
		res.setHeader('content-type', 'application/json');
		res.statusCode = 500;
		res.send('Internal server error:500');
	}
});

app.post('/api/classify', async (req, res) => {
	const { folder, file, task, label } = req.body;
	try {
		//Add to label to json
		let labels = [];
		const buffer = await asyncFs.readFile('user_files/labels.json').catch((err) => console.log(err));
		if (buffer === undefined) {
			labels = [];
		} else {
			labels = JSON.parse(buffer);
		}
		console.log(labels);
		labels.push({ fileName: file, task: task, label: label });
		console.log(labels);
		await asyncFs.writeFile('user_files/labels.json', JSON.stringify(labels));
		//Check if folder for label exists
		if (!fs.existsSync('output_files/' + task)) {
			console.log('Folder created 1');
			fs.mkdirSync('output_files/' + task);
		}
		if (!fs.existsSync('output_files/' + task + '/' + label)) {
			console.log('Folder created 2 ');
			fs.mkdirSync('output_files/' + task + '/' + label);
		}
		await asyncFs.rename('input_files/' + folder + '/' + file, 'output_files/' + task + '/' + label + '/' + file);
		res.setHeader('content-type', 'application/json');
		res.statusCode = 200;
		res.send('Moved file');
	} catch (e) {
		console.log(e);
		res.setHeader('content-type', 'application/json');
		res.statusCode = 500;
		res.send('Internal server error:500');
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
