# MusicLabel
MusicLabel is a music file categorizer. You can place a large portion of music files and quickly sort them.

## Usage
Inside the project there is a folder called /input_files, inside this folder create a folder for each task you want to do. For example if you want to categorise your classical music, but also do another task classing techno, make two different folders, placing the music for each in the respective folder.

Run the project, from there create a task, selecting the folder relevant for the task and adding the labels.

When you classify your files they will output to the folder /output_files. The naming convention for where the files are placed go as /output_files/TASKNAME/LABELNAME/

## Installation
To install MusicLabel you'll need to have node.js install on your computer.

Once you've cloned this project by doing 
```bash
git clone git@github.com:alexHewittProcter/MusicLabel.git
```

You then need to run
```bash
npm run deepInstall
```

Thats all you need to do to install MusicLabel

## Running
To run MusicLabel run
```bash
npm run start
```