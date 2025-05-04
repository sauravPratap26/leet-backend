import { Router } from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";
import {
    createProblem,
    deleteProblem,
    getAllProblem,
    getAllProblemsSolvedByUser,
    getProblemById,
    updateProblemById,
} from "../controllers/problem.controller.js";
const router = Router();

router.post("/create-problem", authMiddleware, checkAdmin, createProblem);
router.post("/get-all-problem", authMiddleware, getAllProblem);
router.post("/get-problem/:id", authMiddleware, getProblemById);
router.post(
    "/update-problem/:id",
    authMiddleware,
    checkAdmin,
    updateProblemById,
);
router.post("/delete-problem/:id", authMiddleware, checkAdmin, deleteProblem);
router.post("/get-solved-problems", authMiddleware, getAllProblemsSolvedByUser);

export default router;
