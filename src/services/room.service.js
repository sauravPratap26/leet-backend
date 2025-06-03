import { RoomRole } from "../generated/prisma/index.js";
import { db } from "../libs/db.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { generateTimeBasedCode } from "../utils/utility.js";

export const createRoomService = async ({ name, description, userId }) => {
    try {
        const code = generateTimeBasedCode();

        const room = await db.room.create({
            data: {
                name,
                description,
                code,
                userId,
            },
        });

        const filteredRoom = {
            id: room.id,
            name: room.name,
            description: room.description,
            code: room.code,
            createdById: room.createdById,
        };

        return new ApiResponse(201, 8031, filteredRoom);
    } catch (error) {
        console.log(error);
        return new ApiError(400, 1030);
    }
};

export const getCreatedRoomsService = async ({ userId }) => {
    try {
        const rooms = await db.room.findMany({
            where: {
                userId,
                isDeleted: false,
            },
        });

        if (!rooms) {
            return new ApiError(404, 1029);
        }

        return new ApiResponse(200, rooms);
    } catch (error) {
        console.log(error);
        return new ApiError(400, 1035);
    }
};

export const deleteRoomService = async ({ id, userId }) => {
    try {
        const room = await db.room.findFirst({
            where: {
                id,
                userId,
                isDeleted: false,
            },
        });
        if (!room) return new ApiError(400, 1029);
        await db.room.delete({
            where: {
                userId,
                id,
            },
        });
        return new ApiResponse(200, 8032);
    } catch (error) {
        console.log(error);
        return new ApiError(400, 1031);
    }
};

export const updateRoomService = async ({ id, userId, name, description }) => {
    try {
        const room = await db.room.findFirst({
            where: {
                id,
                userId,
                isDeleted: false,
            },
        });
        if (!room) return new ApiError(400, 1029);
        const updatedRoom = await db.room.update({
            where: {
                id,
            },
            data: {
                name,
                description,
            },
        });
        return new ApiResponse(200, 8033, {
            name: updatedRoom.name,
            description: updatedRoom.description,
            code: updatedRoom.code,
            createdById: updatedRoom.createdById,
        });
    } catch (error) {
        console.log(error);
        return new ApiError(400, 1032);
    }
};

export const generateRoomCodeService = async ({ id, userId }) => {
    try {
        const roomOwner = await db.room.findFirst({
            where: {
                id,
                userId,
                isDeleted: false,
            },
        });

        const roomTeacher = await db.roomMember.findFirst({
            where: {
                roomId: id,
                userId,
                banned: false,
                role: RoomRole.TEACHER,
                leftAt: null,
            },
        });

        if (!roomOwner && !roomTeacher) {
            return new ApiError(400, 1029);
        }

        const code = generateTimeBasedCode();

        const updatedRoom = await db.room.update({
            where: { id },
            data: { code },
        });

        if (!updatedRoom) {
            return new ApiError(400, 1034);
        }

        return new ApiResponse(201, 8034, { code: updatedRoom.code });
    } catch (error) {
        console.log(error);
        return new ApiError(400, 1033);
    }
};

export const getUserRoomsService = async ({ userId }) => {
    try {
        const userRooms = await db.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                RoomMember: {
                    where: {
                        leftAt: null,
                        banned: false,
                    },
                    include: {
                        room: true,
                    },
                },
            },
        });

        return new ApiResponse(200, userRooms);
    } catch (error) {
        console.log(error);
        return new ApiError(400, 1036);
    }
};

export const joinRoomUsingCodeService = async ({ code, userId }) => {
    try {
        const result = await db.$transaction(async (tx) => {
            // Find the room of user code
            const room = await tx.room.findFirst({
                where: {
                    code,
                    isDeleted: false,
                    isOpen: true,
                },
            });

            if (!room) {
                return new ApiError(404, 1029);
            }

            // Check if already an active member
            const activeMember = await tx.roomMember.findFirst({
                where: {
                    roomId: room.id,
                    userId,
                    leftAt: null,
                },
            });

            if (activeMember) {
                return new ApiError(400, 1038);
            }

            // Check past membership of user
            // if user was banned in past then reject
            //allow rejoin
            const pastMember = await tx.roomMember.findFirst({
                where: {
                    roomId: room.id,
                    userId,
                    NOT: {
                        leftAt: null,
                    },
                },
            });

            if (pastMember) {
                if (pastMember.banned) {
                    return new ApiError(403, 1039);
                }

                const rejoinedMember = await tx.roomMember.update({
                    where: { id: pastMember.id },
                    data: {
                        leftAt: null,
                        joinedAt: new Date(),
                    },
                });

                return new ApiResponse(200, 8037, rejoinedMember);
            }

            //New member joining
            const newMember = await tx.roomMember.create({
                data: {
                    roomId: room.id,
                    userId,
                    role: "STUDENT",
                },
            });

            return new ApiResponse(200, 8038, newMember);
        });

        return result;
    } catch (error) {
        console.error(error);
        return new ApiError(400, 1037);
    }
};

export const leaveRoomService = async ({ id, userId }) => {
    try {
        const result = await db.$transaction(async (tx) => {
            const room = await tx.room.findFirst({
                where: {
                    id,
                    isDeleted: false,
                },
            });

            if (!room) {
                return new ApiError(404, 1029);
            }

            const activeMember = await tx.roomMember.findFirst({
                where: {
                    roomId: id,
                    userId,
                    leftAt: null,
                },
            });

            if (!activeMember) {
                return new ApiError(400, 1041);
            }

            const updatedMember = await tx.roomMember.update({
                where: {
                    id: activeMember.id,
                },
                data: {
                    leftAt: new Date(),
                },
            });

            return new ApiResponse(200, 8041, updatedMember);
        });
        return result;
    } catch (error) {
        console.error(error);
        return new ApiError(400, 1040);
    }
};
