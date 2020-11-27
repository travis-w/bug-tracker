const fs = require("fs");
const path = require("path");

const ARTIFACT_LOCATION = "./test_artifacts";

const saveTestArtifact = (file, fileName, type, bugId, testId) => {
  const subFolder = type === "screenshot" ? "screenshots" : "";

  const artifactPath = path.join(ARTIFACT_LOCATION, bugId, testId, subFolder);

  if (!fs.existsSync(artifactPath)) {
    fs.mkdirSync(artifactPath, { recursive: true });
  }

  fs.renameSync(file, path.join(artifactPath, fileName));
};

module.exports = {
  saveTestArtifact
}