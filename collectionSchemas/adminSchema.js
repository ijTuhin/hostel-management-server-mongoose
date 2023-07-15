const mongoose = require("mongoose");
const date = new Date().toLocaleDateString();
const adminSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["meal", "warden", "accountant"],
  },
  status: Boolean,
  month: String,
  posted: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Notice",
    },
  ],
  notice: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Notice",
    },
  ],
  message: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
  ],
  edit: [
    {
      user: { type: mongoose.Types.ObjectId, ref: "User" },
      address: String,
      thana: String,
      district: String,
      phone: String,
    },
  ],
});

module.exports = adminSchema;
