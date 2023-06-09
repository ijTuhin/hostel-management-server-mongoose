const mongoose = require("mongoose");
const date = new Date().toLocaleDateString();
const messageSchema = mongoose.Schema({
  to: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
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
});

module.exports = messageSchema;
