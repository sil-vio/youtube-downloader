const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const path = require("path");

const app = express();



app.use(cors());

app.listen(4000, () => {
  console.log("Server Works !!! At port 4000");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/downloadmp3", (req, res) => {
  var url = req.query.url;
  res.header("Content-Disposition", 'attachment; filename="audio.mp3"');
  const video = ytdl(url, {
      quality: "highestaudio",
      format: "mp3",
      filter: "audioonly"
	});
	video.pipe(res);
	video.on('error', (e) => { console.error("Errore: ", e);})
});

app.get("/downloadmp4", (req, res) => {
  var url = req.query.url;
  res.header("Content-Disposition", 'attachment; filename="video.mp4"');
  const video = ytdl(url, {
    quality: "highestvideo",
    format: "mp4"
  });
  video.pipe(res);
	video.on('error', (e) => { console.error("Errore: ", e);})
});


// Opens the image in the default image viewer
//(async () => {
  // Opens the url in the default browser
//  await open('http://127.0.0.1:4000/');
//})();