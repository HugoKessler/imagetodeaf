const express = require("express");

const router = express.Router();
const fetch = require("node-fetch");

const pythonApiUrl = "http://localhost:5000";
router.post("/file", async (req, res) => {
  try {
    const images = req.body;
    const token = 50;

    const summaryString = await fetch(pythonApiUrl + "/summary/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images, token }),
    });

    const summaryAudio = await fetch(pythonApiUrl + "/audio/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(summaryString),
    });

    //send images to python api
    res.status(200).send({ ok: true, data: summaryAudio });

    // res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/live", async (req, res) => {
  try {
    console.log("you are here");
    console.log(req.body);
    const image = req.body;

    const imageDescription = await fetch(pythonApiUrl + "/text/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(image),
    });

    const audioDescription = await fetch(pythonApiUrl + "/audio/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(imageDescription),
    });
    //send images to python api
    res.status(200).send({ ok: true, data: summaryAudio });

    // res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/image", async (req, res) => {
  try {
    const image = req.body;
    //send images to python api

    const imageDescription = await fetch(pythonApiUrl + "/text/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(image),
    });

    const audioDescription = await fetch(pythonApiUrl + "/audio/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(imageDescription),
    });
    res.status(200).send({ ok: true, data: audioDescription });

    // res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
