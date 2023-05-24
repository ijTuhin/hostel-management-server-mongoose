const mongoose = require("mongoose");
const seatSchema = mongoose.Schema({
  room: Number,
  member: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      validate: {
        validator: function () {
          return !(this.member.length > 6);
        },
      },
    },
  ],
  vacant: {
    type: Number,
    default: function () {
      if (this.member.length < 6) {
        return 6-this.member.length;
      }
      return "0";
    },
  },
  vacancy: {
    type: Boolean,
    default: function () {
      if (this.member.length < 6) {
        return true;
      }
      return false;
    },
  },
});

module.exports = seatSchema;
