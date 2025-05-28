import express, { urlencoded } from "express";
import errorHandler from "./utils/error-handler.js";
import authRoutes from "../src/routes/auth.routes.js";
import healthRoutes from "../src/routes/health.routes.js";
import problemRoutes from "../src/routes/problem.routes.js";
import executeCodeRoutes from "../src/routes/execute-code.routes.js";
import submissionRoutes from "../src/routes/submission.routes.js";
import playlistRoutes from "../src/routes/playlist.routes.js";
import tagsRoutes from "../src/routes/tag.routes.js";
import profileRoutes from "../src/routes/profile.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL
];

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("****** CORS ERROR ******")
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/execute-code", executeCodeRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/tags", tagsRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use(errorHandler);

export default app;
