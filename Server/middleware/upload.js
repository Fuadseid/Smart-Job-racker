const multer = require("multer");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status").status;

const upload = multer({
  storage: multer.memoryStorage(), // keeps file in memory
  fileFilter: function (req, file, cb) {
    const maxsize = 3 * 1024 * 1024;
    if (!file.originalname.match(/.(pdf)$/)) {
      cb(new ApiError(httpStatus.BAD_REQUEST, "Only pdf file is Allowed"));
    } else if (file.size > maxsize) {
      cb(new ApiError(httpStatus.BAD_REQUEST, "File size exceeds limit"));
    } else {
      cb(null, true);
    }
  },
});

module.exports = upload;