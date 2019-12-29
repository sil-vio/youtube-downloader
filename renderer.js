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
var bar = document.getElementById("myBar");
var close = document.getElementsByClassName("closebtn");
var URLinput = document.querySelector(".URL-input");

bar.style.display = "none";

var nomeFile = "audio.mp3";
var lista = [];

mp3Btn.addEventListener("click", () => {
	const url = URLinput.value;
	console.log(`URL: ${url}`);
	ytdl.getInfo(url, (err, info) => {
		console.log("info ", info);
		nomeFile = info.title + ".mp3";
		const video = ytdl(url, {
			quality: "highestaudio",
			format: "mp3",
			filter: "audioonly"
		});

		video.pipe(fs.createWriteStream(nomeFile));
		video.once('response', () => {
			bar.style.display = "block";
			starttime = Date.now();
		});

		video.on('progress', (chunkLength, downloaded, total) => {
			const percent = downloaded / total;
			const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
			readline.cursorTo(process.stdout, 0);
			let percentString = (percent * 100).toFixed(2);
			process.stdout.write(`${percentString}% downloaded `);
			let downloadedSize = (downloaded / 1024 / 1024).toFixed(2);
			let totalSize = (total / 1024 / 1024).toFixed(2);
			process.stdout.write(`(${downloadedSize}MB of ${totalSize}MB)\n`);
			let downloadedMinutesText = downloadedMinutes.toFixed(2)
			process.stdout.write(`running for: ${downloadedMinutesText}minutes`);
			let estimatedMinutesText = (downloadedMinutes / percent - downloadedMinutes).toFixed(2);
			process.stdout.write(`, estimated time left: ${estimatedMinutesText}minutes `);
			readline.moveCursor(process.stdout, 0, -1);
			bar.style.width = (percent * 100) + "%";
			bar.innerHTML = percentString + "%" + " tempo stimato : " + estimatedMinutesText + " minuti";
		});
		video.on('end', () => {
			bar.style.display = "none";
			close[0].parentElement.style.display = "block";
			process.stdout.write('\n\n');
		});
		video.on('error', (e) => {
			console.error("Errore: ", e);
			close[1].parentElement.style.display = "block";
		});
	});


});

for (let i = 0; i < close.length; i++) {
	close[i].parentElement.style.display = "none";
	close[i].onclick = function () {
		var div = this.parentElement;
		div.style.opacity = "0";
		setTimeout(function () { div.style.display = "none"; }, 600);
	}
}
