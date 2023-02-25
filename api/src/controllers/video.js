const express = require("express");

const router = express.Router();
const fs = require("fs");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

router.post("/", async (req, res) => {
  try {
    console.log("you are here");
    console.log(req.body);
    console.log(req.files);
    const video = req.files.video;
    const images = await extractFrames(video);
    console.log(images);
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

async function extractFrames(video) {
  const videoPath = video.tempFilePath;
  const outputPath = "/tmp/frame-%03d.png";
  const command = `ffmpeg -i ${videoPath} -vf fps=1 ${outputPath}`;

  await exec(command);

  const images = [];

  // Read the extracted images from the output directory
  const files = fs.readdirSync("/tmp");
  for (const file of files) {
    if (file.startsWith("frame-") && file.endsWith(".png")) {
      const imagePath = `/tmp/${file}`;
      const imageData = fs.readFileSync(imagePath, { encoding: "base64" });
      images.push(`data:image/png;base64,${imageData}`);
      fs.unlinkSync(imagePath);
    }
  }

  return images;
}

module.exports = router;
