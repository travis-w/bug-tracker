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
  res.json(await Bug.find({}, ["_id", "name", "status", "date"], {sort: '-date'}));
})

app.post("/bugs", async (req, res) => {
  const results = await runCypress(req.body.test);

  // Error with test run
  if (results.error) {
    return res.status(400).json({
      error: results.error
    });
  }

  // Don't save  bug if test passes (submit only)
  if(results.passed && !req.body.preview) {
    return res.status(400).json({
      error: "Test passed. Invalid bug" 
    });
  }

  // Move video
  const videoName = path.basename(results.video);

  fs.renameSync(results.video, path.join(VIDEO_LOCATION, videoName));

  const bug = new Bug({
    name: req.body.name,
    description: req.body.description,
    test: req.body.test,
    video: videoName
  });

  if (!req.body.preview) {
    await bug.save();

    return res.json({
      bugId: bug._id
    })
  }

  res.json({
    video: `/videos/${videoName}`
  });
});

app.get("/bugs/:id", async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  const result = validId ? await Bug.findById(req.params.id) : null;
  
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: "No results found" });
  }
})

app.delete("/bugs/:id", async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  const result = validId ? await Bug.findOneAndDelete({ _id: req.params.id }) : null;

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: "No results found" });
  }
});

app.post("/bugs/:id/test", (req, res) => {
  // Run test for 
  res.json({ temp: "Starting Test" })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});