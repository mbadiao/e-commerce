const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const routes = require("express").Router();

// Configurez Passport avec la stratégie Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const user = { id: profile.id, ...profile };
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Route pour démarrer l'authentification avec Google
routes.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  })
);

// Route pour gérer le callback de Google après authentification
routes.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("Reached callback");
    if (!req.user) {
      console.log("No user found");
      return res.redirect("/login");
    }

    // Generate a token and send it to the client
    const token = jwt.sign(req.user, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Generated Token:", token); // Log the token for debugging
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

module.exports = routes;
