const express = require("express");

const router = express.Router();
const fs = require("fs");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

router.post("/", async (req, res) => {
  try {
    console.log("you are here");
    console.log(req.body);
    const images = req.body;
    //send images to python api
    res.status(200).send({ ok: true });

    // res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
