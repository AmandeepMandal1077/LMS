import express from "express";
import ExpressMongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import hpp from "hpp";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

//logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//security
app.use(hpp());
app.use(helmet());
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000, //15 min
    limit: 100,
  })
);

//body-parsing
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

//data sanitization
app.use(ExpressMongoSanitize());

//cors
const corsOptions = {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

//failed route
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "Page not found",
  });
});

//Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: "error",
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? "🔒" : err.stack,
  });
});

export default app;
