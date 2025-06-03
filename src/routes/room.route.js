import express from "express";
import {
    authMiddleware,
    checkRoomCreator,
} from "../middlewares/auth.middleware.js";
import validate from "../utils/validator.js";
import { createRoomValiation } from "../validators/index.js";
import { createRoom } from "../controllers/room.controller.js";
const router = express.Router();

router.post(
    "/create-room",
    validate({ schema: createRoomValiation() }),
    authMiddleware,
    checkRoomCreator,
    createRoom,
);
export default router;
