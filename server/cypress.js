const cypress = require("cypress");

const runCypress = (fileName) => {
  return new Promise((resolve, reject) => {
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
    });
  })
}

module.exports = {
  runCypress
}