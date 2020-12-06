const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  displayName: String,
  dateRegistered: { type: Date, default: Date.now },
  role: { type: Number, default: 0 },
});

UserSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = {
  User: User,
};
