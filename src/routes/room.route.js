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
    getCreatedRooms,
    getRoomMemberPermission,
    getUserRooms,
    joinCreatorRoom,
    joinRoomUsingCode,
    leaveRoom,
    openCloseRoom,
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
router.get(
    "/get-created-rooms",
    authMiddleware,
    checkRoomCreator,
    getCreatedRooms,
);
router.delete("/delete-room", authMiddleware, checkRoomCreator, deleteRoom);
router.post("/update-room", authMiddleware, checkRoomCreator, updateRoom);
router.get("/get-user-room", authMiddleware, getUserRooms);
router.post("/generate-room-code", authMiddleware, generateRoomCode);
router.post("/join-room-code", authMiddleware, joinRoomUsingCode);
router.post("/leave-room", authMiddleware, leaveRoom);
router.post(
    "/join-room-creator",
    authMiddleware,
    checkRoomCreator,
    joinCreatorRoom,
);
router.get("/get-room-member/:id", authMiddleware, getRoomMemberPermission);
router.post(
    "/update-room-settings",
    authMiddleware,
    checkRoomCreator,
    openCloseRoom,
);
export default router;
