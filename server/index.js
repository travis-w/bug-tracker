const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const { Bug } = require("./models/bug");
const { runCypress } = require("./cypress");

const app = express();
const port = 8081;

const VIDEO_LOCATION = "./videos";

// Setup Mongo
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/BugTracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());
app.use("/videos", express.static("videos"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/bugs", async (req, res) => {
  res.json(await Bug.find({}, ["_id", "name"]));
})

app.post("/bugs", async (req, res) => {
  let results;

  try {
    results = await runCypress(req.body.test);
  } catch (err) {
    console.log("ERROR")
  }

  const runData = results.runs[0];

  // Move video
  const videoName = path.basename(runData.video);

  fs.renameSync(runData.video, path.join(VIDEO_LOCATION, videoName));

  const bug = new Bug({
    name: req.body.name,
    description: req.body.description,
    test: req.body.test,
    video: videoName
  })

  bug.save()
    .then(() => {
      console.log("BUG SAVED")
      res.json({
        video: `/videos/${videoName}`
      });
    })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});