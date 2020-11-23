const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const { runCypress } = require("./cypress")

const app = express();
const port = 8081;

const TEST_LOCATION = "./cypress/integration";
const VIDEO_LOCATION = "./videos";

app.use(express.json());
app.use('/videos', express.static('videos'));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/bug', (req, res) => {
  const fileName = `temp_${+new Date()}.spec.js`;
  const filePath = path.join(TEST_LOCATION, fileName);

  fs.writeFileSync(filePath, req.body.test);

  runCypress(fileName)
    .then((results) => {
      // Get run data
      const runData = results.runs[0];

      fs.writeFileSync('./file.json', JSON.stringify(results, null, 2))

      // Move video
      const videoName = path.basename(runData.video);

      fs.renameSync(runData.video, path.join(VIDEO_LOCATION, videoName));

      res.json({
        video: `/videos/${videoName}`
      });
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      fs.unlinkSync(filePath);
    })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});