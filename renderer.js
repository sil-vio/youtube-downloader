// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const ytdl = require("ytdl-core");
const fs = require('fs');
const readline = require('readline');

var mp3Btn = document.getElementById("mp3");
var mp4Btn = document.getElementById("mp4");
var URLinput = document.querySelector(".URL-input");


mp3Btn.addEventListener("click", () => {
	const url = URLinput.value;
	console.log(`URL: ${url}`);
	const video = ytdl(url, {
		quality: "highestaudio",
		format: "mp3",
		filter: "audioonly"
	});
	video.pipe(fs.createWriteStream('audio.mp3'));
	video.once('response', () => {
		starttime = Date.now();
	});
	video.on('progress', (chunkLength, downloaded, total) => {
		const percent = downloaded / total;
		const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
		readline.cursorTo(process.stdout, 0);
		process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
		process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
		process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
		process.stdout.write(`, estimated time left: ${(downloadedMinutes / percent - downloadedMinutes).toFixed(2)}minutes `);
		readline.moveCursor(process.stdout, 0, -1);
	});
	video.on('end', () => {
		process.stdout.write('\n\n');
	});
	video.on('error', (e) => { console.error("Errore: ", e); });
});

mp4Btn.addEventListener("click", () => {
	console.log(`URL: ${URLinput.value}`);
});
