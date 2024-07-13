import User from "../Models/userModel.js";
import asyncHandler from "express-async-handler";
import GenerateToken from "../Utils/generateToken.js";
import bcrypt from "bcryptjs";
import passport from "../Configurations/passport.js";
import jwt from "jsonwebtoken";

const AuthUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ token: token, message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

const RegisterUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const exitedUser = await User.findOne({ email });

  if (exitedUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  if (user) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    return res.status(200).json({ token: token, message: "register successful" });
  }
  return res.status(401).json({ message: "Invalid email or password" });
});

const googleAuth = asyncHandler(async (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
});

const callbackProvider = asyncHandler((req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/auth", failureFlash: true },
    (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.redirect("/auth");

      req.logIn(user, (err) => {
        if (err) return next(err);

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.redirect(`https://sunushop.vercel.app?token=${token})}`);
      });
    }
  )(req, res, next);
});

const logout = asyncHandler(async (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export { AuthUser, RegisterUser, googleAuth, callbackProvider, logout };
