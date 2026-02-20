const { Strategy: jwtStrategy, ExtractJwt } = require("passport-jwt");
const httpStatus = require("http-status");
const { tokenTypes } = require("./token");
const UserService = require("../services/user.service");
const config = require("./config");
const ApiError = require("../utils/ApiError");

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new ApiError(httpStatus.status.UNAUTHORIZED, "Invalid token type");
    }
    const user = await UserService.getUserById(payload.sub);
    if (!user) {
      done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const passportJWT = new jwtStrategy(jwtOptions, jwtVerify);

module.exports = { passportJWT };
