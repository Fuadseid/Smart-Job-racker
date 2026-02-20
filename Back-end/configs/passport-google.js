const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const userModel = require("../models/user.model");
const config = require("./config");
const authService = require("../services/auth.service");


const googleOptons = {
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: "/api/auth/google/callback",
};
const googleVerify = async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await  userModel.findOne({ email });
    if (!user) {
      user = await authService.registerUser({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        provider: "google",
      });
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};
const googleStrategy = new GoogleStrategy(googleOptons, googleVerify);
module.exports = { googleStrategy };