import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../Models/userModel.js";
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);const GoogleStrategy = require("passport-google-oauth20").Strategy;
      const passport = require("passport");
      const routes = require("express").Router();
      
      // Configurez Passport avec la stratégie Google OAuth
      passport.use(
        new GoogleStrategy(
          {
            clientID: process.env.clientID,
            clientSecret: process.env.clientSecret,
            callbackURL: "https://sunushop.vercel.app/auth/google/callback",
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
          if (!req.user) {
            return res.redirect("https://sunushop.vercel.app/auth/login");
          }
      
          // Generate a token and send it to the client
          const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });
          res.redirect(`https://sunushop.vercel.app?token=${token}`);
        }
      );
      
      module.exports = routes;
      

      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
});

export default protect;
