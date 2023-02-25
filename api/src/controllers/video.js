const express = require("express");

const router = express.Router();
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const pythonApiUrl = "http://localhost:5000";
router.post("/file", async (req, res) => {
  try {
    const images = req.body;
    console.log("images", images);
    const token = 50;
    const imageDescriptions = [];
    for (const image of images) {
      const imageDescription = await fetch(pythonApiUrl + "/text/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      imageDescriptions.push(imageDescription.data.caption);
    }
    const summaryString = await fetch(pythonApiUrl + "/summary/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: imageDescriptions, tokens_amount: token }),
    });

    const audioDescription = await fetch(pythonApiUrl + "/audio/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: summaryString.data.caption }),
    });

    res.status(200).send({ ok: true, data: { audioDescription, summaryString } });
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

    console.log("image", image);
    const imageDescription = await fetch(pythonApiUrl + "/text/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });

    console.log("imageDescription", imageDescription);

    const audioDescription = await fetch(pythonApiUrl + "/audio/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: imageDescription.data.caption }),
    });
    console.log("audioDescription", audioDescription);
    //send images to python api
    res.status(200).send({ ok: true, data: { audioDescription, imageDescription } });

    // res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/image", async (req, res) => {
  try {
    const image = req.body;

    console.log("image", image);

    const imageDescription = await fetch(pythonApiUrl + "/text/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });

    console.log("imageDescription", imageDescription);

    const audioDescription = await fetch(pythonApiUrl + "/audio/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: imageDescription.data.caption }),
    });

    console.log("audioDescription", audioDescription);
    res.status(200).send({ ok: true, data: { audioDescription, imageDescription } });

    // res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
