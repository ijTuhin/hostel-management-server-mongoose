const mongoose = require("mongoose");
const date = new Date().toLocaleDateString();
const messageSchema = mongoose.Schema({
  to: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    default: "N/A",
  },
  date: {
    type: String,
    default: date,
  },
  sender: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  reply: {
    text: String,
    from: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
  },
  solved: {
    type: Boolean,
    default: false,
  },
});

module.exports = messageSchema;
