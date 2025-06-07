import { date } from "zod";
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
            isOpen: room.isOpen,
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

        return new ApiResponse(203, 8035, rooms);
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
            id: updatedRoom.id,
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

        return new ApiResponse(201, 8034, {
            id: updatedRoom.id,
            code: updatedRoom.code,
        });
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

        return new ApiResponse(200, 8039, userRooms);
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
                include: {
                    room: true,
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

export const joinCreatorRoomService = async ({ id, userId }) => {
    try {
        const result = await db.$transaction(async (tx) => {
            // Find the room of user code
            const room = await tx.room.findFirst({
                where: {
                    id,
                    userId,
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

export const getRoomMemberPermissionService = async ({ roomId, userId }) => {
    try {
        const details = await db.RoomMember.findFirst({
            where: {
                roomId,
                userId,
                leftAt: null,
                banned: false,
            },
        });
        if (!details) {
            return new ApiError(400, 1043);
        }
        return new ApiResponse(200, 8040, details);
    } catch (error) {
        console.error(error);
        return new ApiError(400, 1042);
    }
};

export const openCloseRoomService = async ({ isOpen, id, userId }) => {
    try {
        const oldIsOpen = !isOpen;
        const room = await db.room.findFirst({
            where: {
                id,
                userId,
                isOpen: oldIsOpen,
                isDeleted: false,
            },
        });
        if (!room) {
            return new ApiError(400, 1029);
        }

        const updatedRoom = await db.room.update({
            where: { id },
            data: { isOpen },
        });
        if (!updatedRoom) {
            return new ApiError(400, 1045);
        }
        return new ApiResponse(200, 8041, updatedRoom);
    } catch (error) {
        console.error(error);
        return new ApiError(400, 1044);
    }
};

export const getMembersService = async ({ id, userId }) => {
    try {
        const isTeacher = await db.roomMember.findFirst({
            where: {
                roomId: id,
                userId,
                banned: false,
                role: "TEACHER",
            },
            select: { id: true },
        });
        if (!isTeacher) {
            return new ApiError(400, 1047);
        }
        const members = await db.roomMember.findMany({
            where: {
                roomId: id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!members) {
            return new ApiError(400, 1048);
        }
        return new ApiResponse(200, 8042, members);
    } catch (error) {
        console.error(error);
        return new ApiError(400, 1046);
    }
};

export const getMembersForAdminService = async ({ id, userId }) => {
    try {
        const isCreator = await db.room.findFirst({
            where: {
                id,
                userId,
                isDeleted: false,
            },
        });
        if (!isCreator) {
            return new ApiError(404, 1058);
        }
        const members = await db.roomMember.findMany({
            where: {
                roomId: id,
                leftAt: null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!members) {
            return new ApiError(400, 1059);
        }
        return new ApiResponse(200, 8044, members);
    } catch (error) {
        console.error(error);
        return new ApiError(400, 1060);
    }
};
export const removeStudentService = async ({ userId, studentId, roomId }) => {
    try {
        const result = await db.$transaction(async (tx) => {
            const isTeacher = await tx.roomMember.findFirst({
                where: {
                    roomId,
                    userId,
                    role: "TEACHER",
                    banned: false,
                },
                select: { id: true },
            });

            if (!isTeacher) {
                return new ApiError(403, 1047);
            }

            // Check if the student is an active member (not banned, not left)
            const studentMembership = await tx.roomMember.findFirst({
                where: {
                    roomId,
                    userId: studentId,
                    banned: false,
                    leftAt: null,
                },
                select: { id: true },
            });

            if (!studentMembership) {
                return new ApiError(404, 1050);
            }

            await tx.roomMember.delete({
                where: {
                    roomId_userId: {
                        roomId,
                        userId: studentId,
                    },
                },
            });

            return new ApiResponse(200, 8050);
        });

        return result;
    } catch (error) {
        console.error(error);
        return new ApiError(500, 1052);
    }
};

export const changePermissionsService = async ({
    userId,
    newPermission,
    isBanned,
    ownerId,
    roomId,
    deleteMember,
}) => {
    try {
        const result = await db.$transaction(async (tx) => {
            let updatedMember;
            const isCreator = await tx.room.findFirst({
                where: {
                    id: roomId,
                    userId: ownerId,
                    isDeleted: false,
                },
            });

            if (!isCreator) {
                return new ApiError(404, 1062);
            }

            if (deleteMember) {
                updatedMember = await tx.roomMember.delete({
                    where: {
                        roomId_userId: {
                            roomId,
                            userId,
                        },
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                });
            } else {
                const updateData = {};
                if (newPermission) updateData.role = newPermission;
                if (typeof isBanned === "boolean") updateData.banned = isBanned;
                updatedMember = await tx.roomMember.update({
                    where: {
                        roomId_userId: {
                            roomId,
                            userId,
                        },
                    },
                    data: updateData,
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                });
            }

            return new ApiResponse(200, 8045, updatedMember);
        });

        return result;
    } catch (error) {
        console.error(error);
        return new ApiError(500, 1061);
    }
};
