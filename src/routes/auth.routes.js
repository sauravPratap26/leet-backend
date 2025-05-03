import { Router } from "express";
import {
    get,
    login,
    logout,
    register,
} from "../controllers/auth.controller.js";
import validate from "../utils/validator.js";
import { loginValidation, registerValidation } from "../validators/index.js";
import { authMiddleware as loggedInUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerValidation()), register);
router.post("/login", validate(loginValidation()), login);
router.post("/logout", loggedInUser, logout);
router.get("/get", loggedInUser, get);

export default router;
