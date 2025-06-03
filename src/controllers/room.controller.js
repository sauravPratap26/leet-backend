import {
    createRoomService,
    deleteRoomService,
    generateRoomCodeService,
    getCreatedRoomsService,
    getUserRoomsService,
    joinRoomUsingCodeService,
    leaveRoomService,
    updateRoomService,
} from "../services/room.service.js";
import asyncHandler from "../utils/async-handler.js";

export const createRoom = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id;
    const room = await createRoomService({ name, description, userId });
    return res.status(room.statusCode).send(room);
});

export const getCreatedRoom = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const room = await getCreatedRoomsService({ userId });
    return res.status(room.statusCode).send(room);
});
export const deleteRoom = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const userId = req.user.id;
    const room = await deleteRoomService({ id, userId });
    return res.status(room.statusCode).send(room);
});
export const updateRoom = asyncHandler(async (req, res) => {
    const { name, description, id } = req.body;
    const userId = req.user.id;
    const room = await updateRoomService({ id, name, description, userId });
    return res.status(room.statusCode).send(room);
});
export const generateRoomCode = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const userId = req.user.id;
    const room = await generateRoomCodeService({ id, userId });
    return res.status(room.statusCode).send(room);
});
export const getUserRooms = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const room = await getUserRoomsService({ userId });
    return res.status(room.statusCode).send(room);
});
export const joinRoomUsingCode = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const userId = req.user.id;
    const room = await joinRoomUsingCodeService({ code, userId });
    return res.status(room.statusCode).send(room);
});
export const leaveRoom = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const userId = req.user.id;
    const room = await leaveRoomService({ id, userId });
    return res.status(room.statusCode).send(room);
});
