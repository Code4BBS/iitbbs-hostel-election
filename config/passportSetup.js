const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const config = require("../utils/config");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (user, done) {
  await done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback/",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(async () => {
        try {
          // We have to check whether the email is present in
          // the google sheet of that email
          console.log(profile);
          return done(null, profile);
        } catch (err) {
          return done(null, profile);
        }
      });
    }
  )
);
