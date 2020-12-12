const mongoose = require("mongoose");

const TestResultSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  passed: Boolean,
  // TODO: Define tests schema beyond `Array`
  tests: Array,
  video: Array,
  error: Array,
});

const BugCommentSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  // TODO: Switch to UserId when Auth gets set up
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comment: String,
});

const bugSchemaOpts = { toJSON: { virtuals: true } };
const BugSchema = new mongoose.Schema(
  {
    name: String,
    date: { type: Date, default: Date.now },
    description: String,
    test: String,
    testResults: [TestResultSchema],
    comments: [BugCommentSchema],
    status: {
      type: String,
      default: "Open",
      enum: ["Open", "Closed"],
    },
  },
  bugSchemaOpts
);

BugSchema.virtual("testStatus").get(function () {
  return this.testResults?.[0]?.passed ? "Passing" : "Failing";
});

const Bug = mongoose.model("Bug", BugSchema);

module.exports = {
  Bug: Bug,
};
