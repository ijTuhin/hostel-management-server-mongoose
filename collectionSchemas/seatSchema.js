const mongoose = require("mongoose");
const seatSchema = mongoose.Schema({
  room: String,
  member: [
    {
      type: String,
      validate: {
        validator: function () {
          return !(this.member.length > 6);
        },
      },
      /* default: function () {
        if (this.member.length < 6) {
          return true;
        }
        return false;
      }, */
    },
  ],
  vacant: {
    type: String,
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
