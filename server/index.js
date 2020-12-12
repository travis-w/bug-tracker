const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

const util = require("./util");
const { Bug } = require("./models/bug");
const { User } = require("./models/user");
const { runCypress } = require("./cypress");

const app = express();
const port = 8081;

const VIDEO_LOCATION = "./videos";
const ARTIFACT_LOCATION = "./test_artifacts";
const JWT_SECRET = "JWTSECRET";

app.use(cors());
app.use(express.json());
app.set("json spaces", 2);
app.use(passport.initialize());

// Setup Mongo
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/BugTracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const passportJwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

// Setup Passport
passport.use(
  new JwtStrategy(passportJwtOptions, async (jwt_payload, done) => {
    const user = await User.findOne({ user: jwt_payload.email });

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  })
);

app.use("/videos", express.static("test_artifacts"));

app.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.send("Hello World!");
});

app.get("/bugs", async (req, res) => {
  res.json(
    await Bug.find({}, ["_id", "name", "status", "date"], { sort: "-date" })
  );
});

app.post(
  "/bugs",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const results = await runCypress(req.body.test);

    // Error with test run
    if (results.error) {
      return res.status(400).json({
        error: results.error,
      });
    }

    // Don't save  bug if test passes (submit only)
    if (results.passed && !req.body.preview) {
      return res.status(400).json({
        error: "Test passed. Invalid bug",
      });
    }

    // Save artifacts
    const videoName = path.basename(results.video);

    const bug = new Bug({
      name: req.body.name,
      description: req.body.description,
      test: req.body.test,
      testResults: [results],
    });

    if (!req.body.preview) {
      const saved = await bug.save();

      util.cleanTestResult(
        saved.testResults[0],
        saved._id.toString(),
        saved.testResults[0]._id.toString()
      );

      util.saveTestArtifact(
        results.video,
        "run.mp4",
        "video",
        saved._id.toString(),
        saved.testResults[0]._id.toString()
      );

      saved.markModified("testResults");
      await saved.save();

      return res.json({
        bugId: bug._id,
      });
    }

    // TODO: Figure out way to dispose of video after retrieved
    fs.renameSync(results.video, path.join(VIDEO_LOCATION, videoName));

    res.json({
      video: `/videos/${videoName}`,
    });
  }
);

app.get("/bugs/:id", async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  const result = validId
    ? await Bug.findById(req.params.id).populate("comments.user")
    : null;

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: "No results found" });
  }
});

app.delete(
  "/bugs/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    const result = validId
      ? await Bug.findOneAndDelete({ _id: req.params.id })
      : null;

    if (result) {
      const artifacts = path.join(ARTIFACT_LOCATION, result._id.toString());

      if (fs.existsSync(artifacts)) {
        fs.rmdirSync(artifacts, { recursive: true });
      }

      res.json(result);
    } else {
      res.status(404).json({ error: "No results found" });
    }
  }
);

app.post(
  "/bugs/:id/test",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Re-run test
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    const result = validId ? await Bug.findById(req.params.id) : null;

    if (result) {
      const testResults = await runCypress(result.test);

      result.testResults.unshift(testResults);

      util.cleanTestResult(
        result.testResults[0],
        result._id.toString(),
        result.testResults[0]._id.toString()
      );

      // Save Artifacts
      util.saveTestArtifact(
        testResults.video,
        "run.mp4",
        "video",
        result._id.toString(),
        result.testResults[0]._id.toString()
      );

      const savedResults = await result.save();

      res.json(savedResults.testResults[0]);
    } else {
      res.status(404).json({ error: "No results found" });
    }
  }
);

app.post(
  "/bugs/:id/comments",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    const result = validId ? await Bug.findById(req.params.id) : null;

    if (result) {
      // TODO: Strip stuff from comments probably
      result.comments.unshift({
        comment: req.body.comment,
        user: req.user._id,
      });

      const saved = await result.save();

      res.json({ status: "success", data: saved.comments[0] });
    } else {
      res.status(404).json({ error: "Bug does not exist" });
    }
  }
);

// Register and Login
app.post("/register", async (req, res) => {
  // TODO: Validation
  const userExists = await User.findOne({ email: req.body.email });

  if (userExists) {
    return res
      .status(409)
      .json({ status: "error", message: "User with email already exists" });
  }

  const user = new User({
    email: req.body.email,
    password: util.createHash(`${req.body.email}${req.body.password}`),
  });

  let result = await user.save();

  res.json({
    status: "success",
    message: "User created successfully",
    data: result,
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || util.createHash(`${email}${password}`) !== user.password) {
    return res.sendStatus(401);
  }

  // TODO: Mess with settings
  const payload = { user: user.email };
  const options = { expiresIn: "2d" };

  const token = jwt.sign(payload, JWT_SECRET, options);

  res.json({
    status: "success",
    data: {
      token,
      user,
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
