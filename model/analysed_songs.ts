interface AnalysedSongs {
	tasks: Task[];
}

interface Task {
	name: string;
	analysed: number;
	error: number;
	songs: AnalysedSong[];
}

interface AnalysedSong {
	label: string;
    name: string;
    sampleRate:string;
    bitrate:string;
    duration:number;
    key:string;
    bpm:string;
}
