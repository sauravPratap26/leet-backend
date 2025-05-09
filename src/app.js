import express, { urlencoded } from "express";
import errorHandler from "./utils/error-handler.js";
import authRoutes from "../src/routes/auth.routes.js";
import healthRoutes from "../src/routes/health.routes.js";
import problemRoutes from "../src/routes/problem.routes.js";
import executeCodeRoutes from "../src/routes/execute-code.routes.js"
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/execute-path",executeCodeRoutes)

app.use(errorHandler);

export default app;
