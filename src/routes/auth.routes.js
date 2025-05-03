import { Router } from "express";
import {
    get,
    login,
    logout,
    register,
} from "../controllers/auth.controller.js";
import validate from "../utils/validator.js";
import { loginValidation, registerValidation } from "../validators/index.js";

const router = Router();

router.post("/register", validate(registerValidation()), register);
router.post("/login", validate(loginValidation()), login);
router.post("/logout", logout);
router.get("/get", get);

export default router;
