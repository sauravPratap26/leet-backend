import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { executeCode } from "../controllers/execute-code.controller.js";
import validate from "../utils/validator.js";
import { executeCodeValidation } from "../validators/index.js";
const router = express.Router();

router.get(
    "/",
    authMiddleware,
    validate({ schema: executeCodeValidation }),
    executeCode,
);

export default router;
