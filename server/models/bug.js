var mongoose = require("mongoose");

var BugSchema = new mongoose.Schema({
  name: String,
  date: { type: Date, default: Date.now },
  description: String,
  test: String,
  video: String,
  status: {
    type: String,
    default: "Open",
    enum: ["Open", "Closed"]
  }
});

var Bug = mongoose.model('Bug', BugSchema);

module.exports = {
  Bug: Bug
}