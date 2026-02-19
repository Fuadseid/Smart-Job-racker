const mongoose = require("mongoose");
const { tokenTypes } = require("../configs/token");
const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  type: {
    type: String,
    enum: [tokenTypes.ACCESS, tokenTypes.REFRESH],
    required: true,
  },
  expires:{
    type: Date,
    required: true,
  },
  backlisted:{
    type: Boolean,
    default:false,
  }
});

module.exports = mongoose.model("Token", tokenSchema);