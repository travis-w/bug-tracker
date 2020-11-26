const fs = require("fs");
const path = require("path");

const cypress = require("cypress");

const TEST_LOCATION = "./cypress/integration";

const runCypress = (testContent) => {
  return new Promise(async (resolve, reject) => {
    const fileName = `temp_${+new Date()}.spec.js`;
    const filePath = path.join(TEST_LOCATION, fileName);

    fs.writeFileSync(filePath, testContent);

    cypress.run({
      spec: `./cypress/integration/${fileName}`,
      config: {
        baseUrl: 'https://facebook.com',
        video: true,
      },
      quiet: true
    })
    .then((results) => {
      fs.writeFileSync("file.json", JSON.stringify(results, null, 2));
      const run = results.runs[0];

      resolve({
        passed: results.totalFailed === 0,
        tests: run.tests,
        video: run.video,
        stats: results.stats,
        error: run.error
      })
    })
    .catch((err) => {
      reject(err)
    })
    .finally(() => {
      fs.unlinkSync(filePath);
    });
  })
}

module.exports = {
  runCypress
}