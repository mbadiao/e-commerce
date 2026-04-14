import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../Models/userModel.js";
import { config } from "dotenv";

config();

const hasGoogleOauthConfig =
  Boolean(process.env.OAUTH_CLIENT_ID) &&
  Boolean(process.env.OAUTH_CLIENT_SECRET) &&
  Boolean(process.env.OAUTH_CALLBACK_URL);

if (hasGoogleOauthConfig) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        callbackURL: process.env.OAUTH_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              password: "google",
            });
          }

          return cb(null, user);
        } catch (err) {
          return cb(err);
        }
      }
    )
  );
} else {
  console.warn("Google OAuth is disabled: missing OAUTH_* environment variables");
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
