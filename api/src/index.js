require("dotenv").config();

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

require("./mongo");

const { PORT, APP_URL } = require("./config.js");

const app = express();

const origin = [APP_URL, "http://localhost:8083"];
app.use(cors({ credentials: true, origin }));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(fileUpload({ limits: { fileSize: 1000 * 1024 * 1024 } })); // 10 Mo
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(express.static(__dirname + "/../public"));

app.use("/user", require("./controllers/user"));
app.use("/video", require("./controllers/video"));

console.log("RUNNING ON 1", PORT);
const d = new Date();
console.log(d.toLocaleString());

app.get("/", async (req, res) => {
  const d = new Date();
  res.status(200).send("COUCOU " + d.toLocaleString());
});

require("./passport")(app);

app.listen(PORT, () => console.log("Listening on port " + PORT));
