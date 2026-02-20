const mongoose = require("mongoose");
const validator = require("validator");
const bycrupt = require("bcrypt");
const tojson = require("@meanie/mongoose-to-json");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new ApiError(
            httpStatus.status.BAD_REQUEST,
            "Invalid email format",
          );
        }
      },
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
      minlength: 6,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new ApiError(
            httpStatus.status.BAD_REQUEST,
            "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          );
        }
      },
    },
  },
  { timestamps: true },
);

userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bycrupt.hash(user.password, 8);
  }
});

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return await bycrupt.compare(password, user.password);
};

userSchema.plugin(tojson);

module.exports = mongoose.model("user", userSchema);
