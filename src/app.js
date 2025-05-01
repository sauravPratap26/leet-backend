import express, { urlencoded } from "express";
import errorHandler from "./utils/error-handler.js";
import authRoutes from "../src/routes/auth.routes.js";
import healthRoutes from "../src/routes/health.routes.js";
const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

export default app