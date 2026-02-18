const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const jobActivitySchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["status_changed", "note_added", "interview_scheduled"],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model("jobActivity", jobActivitySchema);
