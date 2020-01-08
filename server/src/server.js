const express = require('express');
const bodyParser = require('body-parser');
const mm = require('music-metadata');
const DecisionTree = require('decision-tree');
const fs = require('fs');
const mv = require('mv');
const background_jobs = require('./background-jobs');
const asyncFs = fs.promises;
const app = express();
const port = 5000;
const analysed_songs_path = './user_files/analysed_songs.json';
const decisionTrees = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const getUserInfo = async () => {
	return await asyncFs.readFile('./user_files/settings.json').catch((err) => console.log(err)).then((data) => {
		if (data === undefined || data.toString() === '') {
			return {};
		} else {
			return data;
		}
	});
};

const getTasks = async () => {
	return await asyncFs
		.readFile('./user_files/tasks.json')
		.catch((err) => console.log(err))
		.then((data) => (data === undefined ? [] : data));
};

const getInputFolders = async () => {
	return await asyncFs
		.readdir('./input_files')
		.catch((err) => console.log(err))
		.then((data) => (data === undefined ? [] : data));
};

const moveFile = (currentPath, newPath) => {
	return new Promise((resolve, reject) => {
		mv(currentPath, newPath, (err) => {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				resolve();
			}
		});
	});
};

const createDecisionTree = async (taskId) => {
	const features = [ 'sampleRate', 'bitrate', 'duration', 'key', 'bpm' ];
	//Get data from analysed songs
	const read = await asyncFs.readFile(analysed_songs_path, 'utf8').then((data) => JSON.parse(data));
	//Get data for task
	let taskObj;
	for (let x = 0; x < read.tasks.length; x++) {
		if (read.tasks[x].name === taskId) {
			taskObj = read.tasks[x];
		}
	}
	if (!taskObj || taskObj.analysed < 2) return null;
	// Calculate amount of test examples
	const testExamplesAmount = Math.ceil(taskObj.analysed * 0.4);
	const trainingExamples = taskObj.songs;
	let testExamples = [];
	for (let x = 0; x < testExamplesAmount; x++) {
		const index = Math.floor(trainingExamples.length * Math.random);
		const obj = trainingExamples.splice(index, 1);
		testExamples = [ ...testExamples, ...obj ];
	}
	const decisionTree = new DecisionTree(trainingExamples, 'label', features);
	const accuracy = decisionTree.evaluate(testExamples);
	let dtFound = false;
	let foundIndex;
	for (let x = 0; x < decisionTrees.length; x++) {
		if (decisionTrees[x].task === taskId) {
			dtFound = true;
			foundIndex = x;
		}
	}
	const finalObj = { tree: decisionTree, accuracy, task: taskId };
	if (dtFound) {
		decisionTrees[foundIndex] = finalObj;
	} else {
		decisionTrees.push(finalObj);
	}
};

const getDecisionTree = async (taskId) => {
	let taskFound = false;
	let taskDecisionTree;
	for (let x = 0; x < decisionTrees.length; x++) {
		if (decisionTrees[x].task === taskId) {
			taskDecisionTree = decisionTrees[x];
			taskFound = true;
		}
	}
	if (taskFound) {
		return taskDecisionTree;
	} else {
		const call = await createDecisionTree(taskId);
		if (call === null) return null;
		return getDecisionTree(taskId);
	}
};

const analyseMusicFiles = (files) => {
	return Promise.all(
		files.filter((filer) => filer !== '.DS_Store').map((file) => {
			return mm.parseFile('input_files/' + folder + '/' + file);
		})
	);
};
// Endpoints
app.get('/api/userinfo', async (_req, res) => {
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
		await asyncFs
			.writeFile('./user_files/settings.json', JSON.stringify(req.body))
			.catch((err) => console.log(err));
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

app.get('/api/tasks', async (_req, res) => {
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
		await asyncFs.writeFile('./user_files/tasks.json', JSON.stringify(req.body)).catch((err) => console.log(err));
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

app.get('/api/inputfolders', async (_req, res) => {
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
		const files = await asyncFs.readdir('./input_files/' + folder);
		let calls = await analyseMusicFiles(files);
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

app.get('/api/predictor/:taskId', async (req, res) => {
	const { taskId } = req.params;
	await createDecisionTree(taskId);
	// Get accuracy for task
	const decisionTree = await getDecisionTree(taskId);
	res.statusCode = 200;
	if (!decisionTree) {
		res.send({ accuracy: 0 });
	} else {
		res.send({ accuracy: decisionTree.accuracy });
	}
});

app.get('/api/predictions/:taskId', async (req, res) => {
	const { taskId } = req.params;
	// Get input folder for task
	// Get files from folder
	// Get data from files
	// 
});

app.post('/api/classify', async (req, res) => {
	const { folder, file, task, label } = req.body;
	try {
		//Check if folder for label exists
		if (!fs.existsSync('./output_files/' + task)) {
			console.log('Task created 1');
			fs.mkdirSync('./output_files/' + task);
		}
		if (!fs.existsSync('./output_files/' + task + '/' + label)) {
			console.log('Label created 2 ');
			fs.mkdirSync('./output_files/' + task + '/' + label);
		}
		let filePath = './input_files/' + folder + '/' + file;
		let outputFilePath = './output_files/' + task + '/' + label + '/' + file;
		if (fs.existsSync(filePath)) {
			await moveFile(filePath, outputFilePath);
			//Add to label to json after success
			let labels = [];
			const buffer = await asyncFs.readFile('./user_files/labels.json').catch((err) => console.log(err));
			if (buffer === undefined) {
				labels = [];
			} else {
				labels = JSON.parse(buffer);
			}
			labels.push({ fileName: file, task: task, label: label });
			await asyncFs.writeFile('./user_files/labels.json', JSON.stringify(labels));
			let job = background_jobs.queue
				.create('analyse_music', {
					file: file,
					task: task,
					label: label
				})
				.save(function(err) {
					if (!err) console.log(job.id);
				});
		}
		res.setHeader('content-type', 'text/plain');
		res.statusCode = 200;
		res.send('Moved file');
	} catch (e) {
		console.log(e);
		res.setHeader('content-type', 'application/json');
		res.statusCode = 500;
		res.send('Internal server error:500');
	}
});

const listenFunc = () => {
	console.log(`Listening on port ${port}`);
	console.log(fs.readdirSync('.'));
	console.log(fs.readdirSync('./user_files'));
	console.log(fs.readdirSync('./input_files'));
	console.log(fs.readdirSync('./output_files'));
	// When run check if user_files exist
	fs.exists('./user_files', async (result) => {
		if (!result) {
			fs.mkdir('./user_files', (err) => {
				console.log(err);
			});
		} else {
			try {
				//Compare the labels in labels.json
				//In comparison to files analysed
				if (fs.existsSync('./user_files/labels.json')) {
					const tasks = {};
					let bufferLabels = await asyncFs
						.readFile('./user_files/labels.json')
						.catch((err) => console.log(err));
					if (bufferLabels === undefined) {
						bufferLabels = [];
					} else {
						bufferLabels = JSON.parse(bufferLabels);
					}
					for (let x = 0; x < bufferLabels.length; x++) {
						const task = bufferLabels[x];
						if (tasks[task.task] == undefined) {
							tasks[task.task] = 1;
						} else {
							tasks[task.task]++;
						}
					}
					let taskArray;
					if (fs.existsSync('./user_files/analysed_songs.json')) {
						let bufferSongs = await asyncFs
							.readFile('./user_files/analysed_songs.json')
							.catch((err) => console.log(err));
						if (bufferSongs === undefined) {
							bufferSongs = [];
						} else {
							bufferSongs = JSON.parse(bufferSongs);
						}
						taskArray = bufferSongs.tasks;
					} else {
						taskArray = [];
					}
					// Loop through tasks
					// Check if analysed songs is the same as labelled songs
					const objectKeys = Object.keys(tasks);
					let found = false;
					let taskNumber;
					let taskName;
					let analysedSongsForTask;
					for (let y = 0; y < objectKeys.length; y++) {
						found = false;
						taskName = objectKeys[y];
						taskNumber = tasks[taskName];
						for (let x = 0; x < taskArray.length; x++) {
							if (taskArray[x].name === objectKeys[y]) {
								analysedSongsForTask = taskArray[x];
								found = true;
							}
						}
						if (!found || taskNumber !== analysedSongsForTask.analysed + analysedSongsForTask.error) {
							//Files need to be reanalysed
							for (let i = 0; i < bufferLabels.length; i++) {
								if (bufferLabels[i].task === objectKeys[y]) {
									let job = background_jobs.queue
										.create('analyse_music', {
											file: bufferLabels[i].fileName,
											task: bufferLabels[i].task,
											label: bufferLabels[i].label
										})
										.save(function(err) {
											if (!err) console.log(job.id);
										});
								}
							}
						}
					}
				}
			} catch (error) {
				console.log(error);
			}
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
};

//Set up background jobs
app.use('/api/kue', background_jobs.kue.app);

module.exports = { port: port, listenFunc: listenFunc, app: app };
