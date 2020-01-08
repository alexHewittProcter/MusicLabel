const fs = require('fs-extra');
const fsAsync = fs.promises;
const { app, port, listenFunc } = require('./server');
const request = require('supertest');

function removeDir(path) {
	fs.readdirSync(path).forEach((extdPath) => {
		if (fs.statSync(path + '/' + extdPath).isDirectory()) {
			removeDir(path + '/' + extdPath);
		} else {
			fs.unlinkSync(path + '/' + extdPath);
		}
	});
	fs.rmdirSync(path);
}

describe('Server API', () => {
	const userFilesDir = 'user_files';
	const inputFilesDir = 'input_files';
	const outputFilesDir = 'output_files';
	beforeAll(async () => {
		//Move all the files used into a differnt folder
		await fsAsync.mkdir('moved_for_test');
		if (fs.existsSync(userFilesDir)) {
			fs.moveSync(userFilesDir + '/', 'moved_for_test/' + userFilesDir + '/');
		}
		//Create user files folder
		fsAsync.mkdir(userFilesDir);

		if (fs.existsSync(inputFilesDir)) {
			fs.moveSync(inputFilesDir + '/', 'moved_for_test/' + inputFilesDir + '/');
		}
		//Create input files folder
		fsAsync.mkdir(inputFilesDir);

		if (fs.existsSync(outputFilesDir)) {
			fs.moveSync(outputFilesDir + '/', 'moved_for_test/' + outputFilesDir + '/');
		}
		//Create output files folder
		fsAsync.mkdir(outputFilesDir);
	});
	afterAll(() => {
		try {
			//Remove user files folder
			if (fs.existsSync('moved_for_test/' + userFilesDir + '/')) {
				removeDir(userFilesDir);
				//Move all the files back
				fs.moveSync('moved_for_test/' + userFilesDir + '/', userFilesDir + '/');
			}

			if (fs.existsSync('moved_for_test/' + inputFilesDir + '/')) {
				//Remove input files folder
				removeDir(inputFilesDir);
				//Move all the files back
				fs.moveSync('moved_for_test/' + inputFilesDir + '/', inputFilesDir + '/');
			}

			if (fs.existsSync('moved_for_test/' + outputFilesDir + '/')) {
				//Remove output files folder
				removeDir(outputFilesDir);
				//Move all the files back
				fs.moveSync('moved_for_test/' + outputFilesDir + '/', outputFilesDir + '/');
				removeDir('moved_for_test');
			}
		} catch (e) {
			console.log(e);
		}
	});

	describe('Getting user info', () => {
		it('Should return an empty object when there is no user data', async () => {
			const res = await request(app).get('/api/userinfo');
			// console.log(res);
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual({});
		});
		it('Should return an empty object when a file exists but is empty', async () => {
			fs.writeFileSync(userFilesDir + '/settings.json', '');
			const res = await request(app).get('/api/userinfo');
			// console.log(res);
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual({});
		});
		it('Should return an object with name and setup key when there is user data', async () => {
			const userData = { name: 'Alex', setup: true };
			await request(app).post('/api/userinfo').send(userData);
			const res = await request(app).get('/api/userinfo');
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual(userData);
		});
	});
	describe('Posting user info', () => {
		it("Should create a settings.json file if doesn't exist", async () => {
			let fileExists = fs.existsSync(userFilesDir + '/settings.json');
			if (fileExists) {
				fs.unlinkSync(userFilesDir + '/settings.json');
			}
			const userData = { name: 'Alex', setup: true };
			const res = await request(app).post('/api/userinfo').send(userData);
			expect(res.statusCode).toEqual(200);
			fileExists = fs.existsSync(userFilesDir + '/settings.json');
			expect(fileExists).toEqual(true);
		});
		it('Should change the json in the file', async () => {
			let userData = { name: 'Alex', setup: true };
			fs.writeFileSync(userFilesDir + '/settings.json', JSON.stringify(userData));
			userData = { ...userData, name: 'George' };
			await request(app).post('/api/userinfo').send(userData);
			let fileData = fs.readFileSync(userFilesDir + '/settings.json');
			fileData = JSON.parse(fileData);
			expect(userData).toEqual(fileData);
		});
	});
	describe('Get tasks', () => {
		it("Should return an empty array when the json file doesn't exist or is empty", async () => {
			const res = await request(app).get('/api/tasks');
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual([]);
		});
		it('Should return array in json file', async () => {
			const taskData = { tasks: [ { name: 'A', folder: 'files', labels: [ 'adsad', 'asd' ] } ] };
			await request(app).post('/api/tasks').send(taskData);
			const res = await request(app).get('/api/tasks');
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual(taskData);
		});
	});
	describe('Posting tasks', () => {
		it("Should create file tasks.json if doesn't exist", async () => {
			if (fs.existsSync(userFilesDir + '/tasks.json')) {
				fs.unlink(userFilesDir + '/tasks.json');
			}
			const taskData = { tasks: [ { name: 'A', folder: 'files', labels: [ 'adsad', 'asd' ] } ] };
			await request(app).post('/api/tasks').send(taskData);
			const fileExists = fs.existsSync(userFilesDir + '/tasks.json');
			expect(fileExists).toEqual(true);
		});
		it('Should replace the tasks.json content', async () => {
			let fileData = fs.readFileSync(userFilesDir + '/tasks.json');
			const taskData = { tasks: [ { name: 'A', folder: 'files', labels: [ 'adsad', 'asd' ] } ] };
			expect(JSON.parse(fileData)).toEqual(taskData);
			const taskData2 = { tasks: [ { name: 'B', folder: 'files', labels: [ '2', '21' ] } ] };
			await request(app).post('/api/tasks').send(taskData2);
			fileData = fs.readFileSync(userFilesDir + '/tasks.json');
			expect(JSON.parse(fileData)).toEqual(taskData2);
		});
	});
	describe('Get folders from input_files folder', () => {
		it('Should return an empty array when there are no folders', async () => {
			const res = await request(app).get('/api/inputfolders');
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual([]);
		});
		it('Should return an array with the values as folder names of all the folders inside input_folders', async () => {
			fs.mkdirSync(inputFilesDir + '/folder1');
			fs.mkdirSync(inputFilesDir + '/folder2');
			const res = await request(app).get('/api/inputfolders');
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual([ 'folder1', 'folder2' ]);
		});
	});
	describe('Get music files from inside folder', () => {
		it('Should return empty array when no files are inside', async () => {
			const res = await request(app).get('/api/files/folder1');
			expect(res.statusCode).toEqual(200);
			expect(res.body.files).toEqual([]);
		});
		it('Should return an array of all the files in the folder and accompaying data', async () => {
			//Place music files into the test_music_files dir
			const files = fs.readdirSync('test_music_files');
			files.forEach((file) => {
				fs.copySync('test_music_files/' + file, 'input_files/folder1/' + file);
			});
			const res = await request(app).get('/api/files/folder1');
			expect(res.statusCode).toEqual(200);
			expect(res.body.files).toHaveLength(20);
			expect(res.body.files[0]).toEqual(
				expect.objectContaining({
					title: expect.any(String),
					artists: [ expect.any(String) ],
					fileName: expect.any(String)
				})
			);
		});
	});
	describe('Post data to classify endpoint', () => {
		it("Should create target folder if it doesn't exist", async () => {
			let folderExists = fs.existsSync(outputFilesDir + '/task_test/label_test');
			if (folderExists) {
				removeDir('/task_test/label_test');
			}
			await request(app).post('/api/classify').send({
				folder: 'folder1',
				file: 'WhatsApp Audio 2019-10-11 at 13.01.00 copy 10.mpeg',
				task: 'task_test',
				label: 'label_test'
			});
			folderExists = fs.existsSync(outputFilesDir + '/task_test/label_test');
			expect(folderExists).toEqual(true);
		});
		it('Should move the file to the folder', async () => {
			await request(app).post('/api/classify').send({
				folder: 'folder1',
				file: 'WhatsApp Audio 2019-10-11 at 13.01.00 copy 11.mpeg',
				task: 'task_test',
				label: 'label_test'
			});
			let fileExists = fs.existsSync(
				outputFilesDir + '/task_test/label_test/WhatsApp Audio 2019-10-11 at 13.01.00 copy 11.mpeg'
			);
			expect(fileExists).toEqual(true);
			fileExists = fs.existsSync(inputFilesDir + '/folder1/WhatsApp Audio 2019-10-11 at 13.01.00 copy 11.mpeg');
			expect(fileExists).toEqual(false);
		});
		it('Should add the data to the labels.json', async () => {
			const file = 'WhatsApp Audio 2019-10-11 at 13.01.00 copy 12.mpeg';
			await request(app).post('/api/classify').send({
				folder: 'folder1',
				file: file,
				task: 'task_test',
				label: 'label_test'
			});
			let labels = fs.readFileSync('user_files/labels.json');
			labels = JSON.parse(labels);
			expect(labels[labels.length - 1].fileName).toEqual(file);
		});
	});
});
