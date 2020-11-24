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

app.use(cors());
app.use(express.json());
app.set('json spaces', 2)

app.use("/videos", express.static("videos"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/bugs", async (req, res) => {
  res.json(await Bug.find({}, ["_id", "name"]));
})

app.post("/bugs", async (req, res) => {
  const results = await runCypress(req.body.test);

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
      res.json({
        video: `/videos/${videoName}`
      });
    })
});

app.get("/bugs/:id", async (req, res) => {
  const result = await Bug.findById(req.params.id)
  
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: "No results found" })
  }
})

app.post("/bugs/:id/test", (req, res) => {
  // Run test for 
  res.json({ temp: "Starting Test" })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});