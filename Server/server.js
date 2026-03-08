const app = require("./app");
const mongoose = require("mongoose");
const passport = require("./configs/passport");
const httpStatus = require("http-status");
const ApiError = require("./utils/ApiError");
const config = require("./configs/config");
const router = require("./routes/main.route");
const cors = require("cors");

app.use(cors());
mongoose
  .connect(config.dbConnection, {})
  .then(() => {
    console.log("Mongoose server connected successfully");
  })
  .catch((err) => {
    new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, "Mongoose server connection failed", true, err.stack);
  });
app.use(passport.initialize());
app.use(router);
app.listen(config.port, () => {
  console.log(`server is running on port ${config.port}`);
});
