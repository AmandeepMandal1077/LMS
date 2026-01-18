import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import ExpressMongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import hpp from "hpp";
import cors from "cors";
import cookieParser from "cookie-parser";

//routers
import healthCheckRouter from "./routes/health.route.js";
import type { ApiError } from "./utils/apiError.js";

//env config
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
  }),
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

//routes
app.use("/health", healthCheckRouter);

//failed route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "error",
    message: "Page not found",
  });
});

//Error handler
app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: "error",
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? "🔒" : err.stack,
  });
});

export default app;
