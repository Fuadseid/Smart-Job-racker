const authService = require("../services/auth.service");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const TokenService = require("../services/token.service");
const register = async (req, res) => {
  console.log("Body", req.body);
  try {
    const user = await authService.registerUser(req.body);
    const tokens = await TokenService.generateAuthToken(user.id);

    res.status(httpStatus.status.CREATED).send({ user, tokens });
  } catch (error) {
    res
      .status(error.statusCode || httpStatus.status.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    const tokens = await TokenService.generateAuthToken(user.id);
    res.status(httpStatus.status.OK).send({ user, tokens });
  } catch (error) {
    res
      .status(error.statusCode || httpStatus.status.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};
