import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    getAllSubmission,
    getAllTheSubmissionsForProblem,
    getSubmissionsForProblem,
} from "../controllers/submission.controller.js";
import validate from "../utils/validator.js";
import { problemParamsValidation } from "../validators/index.js";

const router = express.Router();

router.get("/get-all-submissions", authMiddleware, getAllSubmission);
router.get(
    "/get-submission/:id",
    authMiddleware,
    validate({
        params: problemParamsValidation(),
    }),
    getSubmissionsForProblem,
);
router.get(
    "/get-submissions-count/:id",
    authMiddleware,
    validate({
        params: problemParamsValidation(),
    }),
    getAllTheSubmissionsForProblem,
);

export default router;
