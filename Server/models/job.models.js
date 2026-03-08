const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    jobUrl: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    salaryMin: {
      type: Number,
      min: 0,
    },

    salaryMax: {
      type: Number,
      min: 0,
      validate(value) {
        if (this.salaryMin && value < this.salaryMin) {
          throw new ApiError(
            httpStatus.status.BAD_REQUEST,
            "Maximum salary must be greater than minimum salary"
          );
        }
      },
    },

    status: {
      type: String,
      enum: ["saved", "applied", "interview", "offer", "rejected"],
      default: "saved",
    },

    resumeVersion: {
      type: String,
      trim: true,
    },

    appliedDate: {
      type: Date,
    },

    followUpDate: {
      type: Date,
    },

    notes: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      enum: ["manual", "chrome-extension", "email"],
      default: "manual",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("job", jobSchema);