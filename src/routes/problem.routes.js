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
import validate from "../utils/validator.js";
import {
    createProblemValidation,
} from "../validators/index.js";
const router = Router();

router.post(
    "/create-problem",
    authMiddleware,
    checkAdmin,
    validate(createProblemValidation()),
    createProblem,
);
router.get("/get-all-problem", authMiddleware, getAllProblem);
router.get("/get-problem/:id", authMiddleware, getProblemById);
router.post(
    "/update-problem/:id",
    authMiddleware,
    checkAdmin,
    updateProblemById,
);
router.post("/delete-problem/:id", authMiddleware, checkAdmin, deleteProblem);
router.post("/get-solved-problems", authMiddleware, getAllProblemsSolvedByUser);

export default router;
