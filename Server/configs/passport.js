const passport = require("passport");
const { passportJWT } = require("./passport-jwt");
const {googleStrategy} = require("./passport-google");
passport.use("jwt", passportJWT);
passport.use("google", googleStrategy);

module.exports = passport;