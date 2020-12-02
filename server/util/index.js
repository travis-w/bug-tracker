const fs = require("fs");
const path = require("path");

const ARTIFACT_LOCATION = "./test_artifacts";

const saveTestArtifact = (file, fileName, type, bugId, testId) => {
  const subFolder = type === "screenshot" ? "screenshots" : "";

  const artifactPath = path.join(ARTIFACT_LOCATION, bugId, testId, subFolder);
  const filePath = path.join(artifactPath, fileName);

  if (!fs.existsSync(artifactPath)) {
    fs.mkdirSync(artifactPath, { recursive: true });
  }

  fs.renameSync(file, filePath);

  return filePath;
};

// FIXME: Figure better way of going from test framework => clean => database. Rather than framework => db => clean => db
const cleanTestResult = (testResults, bugId, testId) => {
  // Clean General test data
  let numScreenshots = 0;

  // Clean each test
  testResults.tests.forEach((test) => {
    test.attempts.map((attempt) => {
      // Clean (and save screenshots)
      attempt.screenshots = attempt.screenshots.map((screenshot) => {
        saveTestArtifact(screenshot.path, `${++numScreenshots}.png`, "screenshot", bugId, testId);

        return {
          takenAt: screenshot.takenAt,
          fileName: `${numScreenshots}.png`,
          height: screenshot.height,
          width: screenshot.width
        }
      })
    })
  });
}

module.exports = {
  saveTestArtifact,
  cleanTestResult
}