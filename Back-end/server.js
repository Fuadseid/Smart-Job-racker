const app = require("./app");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const ApiError = require("./utils/ApiError");
const config = require("./configs/config");
mongoose
  .connect(config.dbConnection, {})
  .then(() => {
    console.log("Mongoose server connected successfully");
  })
  .catch((err) => {
    new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, "Mongoose server connection failed", true, err.stack);
  });

app.listen(config.port, () => {
  console.log(`server is running on port ${config.port}`);
});
