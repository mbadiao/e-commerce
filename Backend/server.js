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

config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = Number(process.env.PORT) || 8080;
const normalizeOrigin = (origin = "") => origin.trim().replace(/\/$/, "");
const frontendUrl = normalizeOrigin(
  process.env.FRONTEND_URL || "https://sunushop.vercel.app"
);
const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  frontendUrl ||
  "https://sunushop.vercel.app"
)
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(normalizeOrigin(origin))
      ) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api", routes);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(err);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "hidden" : err.stack,
  });
});

const startServer = async () => {
  try {
    await connectionDataBase();
    app.listen(port, () => {
      console.log(`Server connected on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
