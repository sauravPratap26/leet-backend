import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getTags } from "../controllers/tag.controller.js";

const router = express.Router();

router.get("/getTags", authMiddleware, getTags);

export default router;
