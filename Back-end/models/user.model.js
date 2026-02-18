const mongoose = require("mongoose");
const validator = require("validator");
const bycrupt = require("bcrypt");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
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
  timeStamps: true,
});

userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

userSchema.plugin(tojson);

module.exports = mongoose.model("user", userSchema);
