import { Router } from "express";
import {
    get,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
} from "../controllers/auth.controller.js";
import validate from "../utils/validator.js";
import {
    forgotPasswordValidation,
    loginValidation,
    registerValidation,
} from "../validators/index.js";
import { authMiddleware as loggedInUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validate({ schema: registerValidation() }), register);
router.post("/login", validate({ schema: loginValidation() }), login);
router.post("/logout", loggedInUser, logout);
router.post(
    "/forget-password",
    validate({ schema: forgotPasswordValidation() }),
    forgotPassword,
);
router.post(`/resetPassword/:token`, resetPassword);
router.get("/get", loggedInUser, get);

export default router;
