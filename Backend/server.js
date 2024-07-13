import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import routes from "./Routes/routes.js";
import connectionDataBase from "./Configurations/Database.js";
import cors from "cors";
import passport from "passport";
import session from "express-session";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
config();



// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Set up session support (consider using a more secure store for production)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true } // Uncomment this in production with HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));

// Basic route to check if API is running
app.get("/", (req, res) => {
  res.send("API is running....");
});

const corsOptions = {
  origin: 'https://sunushop.vercel.app',
  credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/api", routes);

// Global error handler middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(err);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? '🥞' : err.stack,
  });
});

// Start the server and listen on specified port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  connectionDataBase();
  console.log(`Server connected on port ${port}`);
});
