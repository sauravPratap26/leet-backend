import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import validate from "../utils/validator.js";
import {
    changeAvatarValidations,
    changePasswordValidation,
} from "../validators/index.js";
import {
    changeAvatar,
    changePassword,
    updateSocials,
} from "../controllers/profile.controller.js";
const router = express.Router();
router.post(
    "/change-password",
    validate({ schema: changePasswordValidation() }),
    authMiddleware,
    changePassword,
);
router.post(
    "/change-avatar",
    validate({ schema: changeAvatarValidations() }),
    authMiddleware,
    changeAvatar,
);
router.post("/update-socials", authMiddleware, updateSocials);

export default router