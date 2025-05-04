import { Router } from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";
const router =Router()

router.post("/create-problem",authMiddleware,checkAdmin)

export default router 