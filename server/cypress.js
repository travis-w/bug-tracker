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
      // TODO: Parse results and condense
      resolve(results)
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