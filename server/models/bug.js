var mongoose = require("mongoose");

var BugSchema = new mongoose.Schema({
  name: String,
  description: String,
  test: String,
  video: String
});

var Bug = mongoose.model('Bug', BugSchema);

module.exports = {
  Bug: Bug
}