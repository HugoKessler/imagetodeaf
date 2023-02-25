const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("you are here");
    const video = req.files.video;
    const fps = 30;

    const canvas = createCanvas(640, 480);
    const ctx = canvas.getContext("2d");

    const images = [];

    const videoDuration = await getVideoDuration(video);

    for (let i = 0; i < videoDuration; i += 1 / fps) {
      const frame = await getVideoFrame(video, i);
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      images.push(imageData);
    }

    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

function getVideoDuration(video) {
  return new Promise((resolve, reject) => {
    const videoPath = video.tempFilePath;
    ffmpeg.ffprobe(videoPath, (error, metadata) => {
      if (error) reject(error);
      resolve(metadata.format.duration);
    });
  });
}

function getVideoFrame(video, time) {
  return new Promise((resolve, reject) => {
    const videoPath = video.tempFilePath;
    const framePath = `/tmp/frame-${time}.png`;

    ffmpeg(videoPath)
      .seek(time)
      .frames(1)
      .on("error", reject)
      .on("end", () => {
        loadImage(framePath)
          .then((image) => {
            fs.unlinkSync(framePath);
            resolve(image);
          })
          .catch(reject);
      })
      .save(framePath);
  });
}

module.exports = router;
