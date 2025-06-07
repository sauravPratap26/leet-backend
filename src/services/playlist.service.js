import { getBasicPlaylistInfo } from "../controllers/playlist.controller.js";
import { db } from "../libs/db.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";

export const getAllListDetailsService = async (userId, roomId = null) => {
    const whereClause = roomId ? { roomId } : { userId, roomId: null };

    const playlist = await db.playlist.findMany({
        where: whereClause,
        include: {
            problems: {
                include: {
                    problem: true,
                },
            },
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

    return new ApiResponse(200, 8018, playlist);
};

export const getPlayListDetailsService = async (
    playlistId,
    userId,
    roomId = null,
) => {
    const whereClause = roomId
        ? { roomId, id: playlistId }
        : { userId, id: playlistId, roomId: null };
    const playlist = await db.playlist.findFirst({
        where: whereClause,
        include: {
            problems: {
                include: {
                    problem: {
                        include: {
                            solvedBy: {
                                where: {
                                    userId,
                                },
                            },
                            tags: true,
                        },
                    },
                },
            },
        },
    });
    if (!playlist) {
        return new ApiError(404, 1019);
    }

    const formattedPlaylistProblems = playlist.problems.map((playlistProb) => {
        const problem = playlistProb.problem;
        return {
            ...problem,
            tags: problem.tags.map((tag) => tag.value),
        };
    });
    return new ApiResponse(200, 8019, formattedPlaylistProblems);
};
export const createPlaylistService = async (
    name,
    description,
    userId,
    roomId = null,
) => {
    const playlist = await db.playlist.create({
        data: {
            name,
            description,
            userId,
            roomId,
        },
        include: {
            problems: {
                include: {
                    problem: true,
                },
            },
        },
    });

    if (!playlist) {
        return new ApiError(400, 1018);
    }
    return new ApiResponse(200, 8017, playlist);
};
export const editPlaylistDetailsService = async (
    name,
    description,
    userId,
    id,
) => {
    const existingPlaylist = await db.playlist.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!existingPlaylist) {
        return new ApiError(400, 1019);
    }
    const updatedPlaylist = await db.playlist.update({
        where: {
            id,
            userId,
        },
        data: {
            name,
            description,
        },
        include: {
            problems: {
                include: {
                    problem: true,
                },
            },
        },
    });
    if (!updatedPlaylist) {
        return new ApiError(400, 1020);
    }
    return new ApiResponse(200, 8023, updatedPlaylist);
};
export const addProblemToPlaylistService = async (playListId, problemId) => {
    const problemInPlaylist = await db.problemInPlaylist.createMany({
        data: problemId.map((id) => ({
            playListId,
            problemId: id,
        })),
    });
    return new ApiResponse(201, 8020, problemInPlaylist);
};
export const deletePlaylistService = async ({ playlistId, userId, roomId }) => {
    try {
        const result = await db.$transaction(async (tx) => {
            if (roomId !== null && roomId !== undefined) {
                //lets check if the userId is a teacher of that room or not
                const isTeacher = await tx.roomMember.findFirst({
                    where: {
                        roomId,
                        userId,
                        banned: false,
                        role: "TEACHER",
                    },
                    select: { id: true },
                });
                if (!isTeacher) {
                    return new ApiError(400, 1064);
                }
                //now lets check if the playlist is a part of this room
                const checkPlaylistInRoom = await tx.playlist.findFirst({
                    where: {
                        id: playlistId,
                        roomId,
                    },
                });
                if (!checkPlaylistInRoom) {
                    return new ApiError(404, 1065);
                }
                //if playlist is a part of room, user is available to delte then simply deleted
                const deletedPlaylist = await db.playlist.delete({
                    where: {
                        id: playlistId,
                    },
                });
                return new ApiResponse(200, 8021, deletedPlaylist);
            } else {
                const deletedPlaylist = await db.playlist.delete({
                    where: {
                        id: playlistId,
                        userId,
                    },
                });
                return new ApiResponse(200, 8021, deletedPlaylist);
            }
        });
        return result;
    } catch (error) {
        console.log(error);
        return new ApiError(400, 1066);
    }
};
export const removeProblemFromPlaylistService = async (
    playListId,
    problemId,
) => {
    const deletedProblem = await db.problemInPlaylist.deleteMany({
        where: {
            playListId,
            problemId: {
                in: problemId,
            },
        },
    });
    return new ApiResponse(200, 8022, deletedProblem);
};

export const getBasicPlaylistInfoService = async ({ id, roomId, userId }) => {
    try {
        const user = await db.roomMember.findUnique({
            where: {
                roomId_userId: {
                    roomId,
                    userId,
                },
            },
        });
        if (!user) {
            return new ApiError(400, 1053);
        }
        const playlist = await db.playlist.findFirst({
            where: {
                id,
                roomId,
            },
            include: {
                problems: true,
            },
        });
        if (!playlist) {
            return new ApiError(400, 1052, playlist);
        }
        return new ApiResponse(200, 8043, playlist);
    } catch (error) {
        console.log(error);
        return new ApiError(400, 1051);
    }
};
