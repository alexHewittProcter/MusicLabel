const kue = require('kue');
const queue = kue.createQueue({ redis: { host: 'redis' } });
const mm = require('music-metadata');
const fs = require('fs');
const asyncFs = fs.promises;
const analysed_songs_path = './user_files/analysed_songs.json';

queue.process('analyse_music', async (job, done) => {
	const { file, task, label } = job.data;
	let analysed_songs;
	let foundTask = false;
	let taskIndex;
	let taskObj;
	if (fs.existsSync(analysed_songs_path)) {
		const read = await asyncFs.readFile(analysed_songs_path, 'utf8').then((data) => JSON.parse(data));
		analysed_songs = read;
	} else {
		analysed_songs = { tasks: [] };
	}
	//Find task obj
	for (let i = 0; i < analysed_songs.tasks.length; i++) {
		let currentObj = analysed_songs.tasks[i];
		if (currentObj.name === task) {
			foundTask = true;
			taskIndex = i;
			taskObj = currentObj;
			break;
		}
	}
	if (foundTask === false) {
		taskObj = {
			name: task,
			analysed: 0,
			error: 0,
			songs: []
		};
	}
	try {
		const analysis = await mm.parseFile('./output_files/' + task + '/' + label + '/' + file);
		const newAnalysis = {
			label: label,
			name: analysis.common.title,
			sampleRate: analysis.format.sampleRate,
			bitrate: analysis.format.bitrate,
			duration: analysis.format.duration,
			key: analysis.common.key,
			bpm: analysis.common.bpm
		};
		taskObj.songs.push(newAnalysis);
		taskObj.analysed++;
	} catch (e) {
		console.log(e);
		console.log('ERROR');
		taskObj.error++;
	}
	if (foundTask) {
		analysed_songs.tasks[taskIndex] = taskObj;
	} else {
		analysed_songs.tasks.push(taskObj);
	}
	await asyncFs.writeFile(analysed_songs_path, JSON.stringify(analysed_songs));
	done();
});
module.exports = { kue: kue, queue: queue };
