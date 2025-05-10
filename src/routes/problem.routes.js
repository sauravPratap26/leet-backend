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
    problemParamsValidation,
    updateProblemValidation,
} from "../validators/index.js";
const router = Router();

router.post(
    "/create-problem",
    authMiddleware,
    checkAdmin,
    validate({ schema: createProblemValidation() }),
    createProblem,
);
router.get("/get-all-problem", authMiddleware, getAllProblem);
router.get(
    "/get-problem/:id",
    authMiddleware,
    validate({ params: problemParamsValidation() }),
    getProblemById,
);
router.post(
    "/update-problem/:id",
    authMiddleware,
    checkAdmin,
    validate({
        body: updateProblemValidation(),
        params: problemParamsValidation(),
    }),
    updateProblemById,
);
router.delete(
    "/delete-problem/:id",
    authMiddleware,
    checkAdmin,
    validate({ params: problemParamsValidation() }),
    deleteProblem,
);
router.get("/get-solved-problems", authMiddleware, getAllProblemsSolvedByUser);

export default router;
