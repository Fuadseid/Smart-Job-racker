const { google } = require("googleapis");
const config = require("../configs/config");
const User = require("../models/user.model");

const readUserEmails = async (userId) => {
  const user = await User.findById(userId);

  if (!user || !user.googleRefreshToken) {
    throw new Error("User has not connected Gmail");
  }

  const oauth2Client = new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.callback
  );

  oauth2Client.setCredentials({
    refresh_token: user.googleRefreshToken
  });

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client
  });

  const response = await gmail.users.messages.list({
    userId: "me",
    q: "subject:(interview OR rejected OR offer)"
  });

  return response.data.messages || [];
};

module.exports = readUserEmails;