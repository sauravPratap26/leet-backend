import express from "express";
import {
    authMiddleware,
    checkRoomCreator,
} from "../middlewares/auth.middleware.js";
import validate from "../utils/validator.js";
import { createRoomValiation } from "../validators/index.js";
import {
    createRoom,
    deleteRoom,
    generateRoomCode,
    getCreatedRoom,
    getUserRooms,
    joinRoomUsingCode,
    leaveRoom,
    updateRoom,
} from "../controllers/room.controller.js";
const router = express.Router();

router.post(
    "/create-room",
    validate({ schema: createRoomValiation() }),
    authMiddleware,
    checkRoomCreator,
    createRoom,
);
router.post(
    "/get-created-room",
    authMiddleware,
    checkRoomCreator,
    getCreatedRoom,
);
router.post("/delete-room", authMiddleware, checkRoomCreator, deleteRoom);
router.post("/update-room", authMiddleware, checkRoomCreator, updateRoom);
router.post("/get-user-room", authMiddleware, getUserRooms);
router.post("/generate-room-code", authMiddleware, generateRoomCode);
router.post("/join-room-code", authMiddleware, joinRoomUsingCode);
router.post("/leave-room", authMiddleware, leaveRoom);
export default router;
