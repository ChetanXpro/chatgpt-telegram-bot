const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  userId: { type: String, index: true },
  username: {
    type: String,
  },
  name: {
    type: String,
  },
  member_left: {
    type: Boolean,
  },
});

module.exports = mongoose.model("OpenAiGroup", Schema);
