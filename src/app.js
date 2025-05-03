import express, { urlencoded } from "express";
import errorHandler from "./utils/error-handler.js";
import authRoutes from "../src/routes/auth.routes.js";
import healthRoutes from "../src/routes/health.routes.js";
import cookieParser from "cookie-parser"
const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(urlencoded({ extended: true }));
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

export default app