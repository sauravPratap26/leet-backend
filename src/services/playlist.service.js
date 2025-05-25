import { db } from "../libs/db.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";

export const getAllListDetailsService = async (userId) => {
    const playlist = await db.playlist.findMany({
        where: {
            userId,
        },
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
export const getPlayListDetailsService = async (playlistId, userId) => {
    const playlist = await db.findUnique({
        where: {
            id: playlistId,
            userId,
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
        return new ApiError(404, 1019);
    }
    return new ApiResponse(200, 8019, playlist);
};
export const createPlaylistService = async (name, description, userId) => {
    const playlist = await db.playlist.create({
        data: {
            name,
            description,
            userId,
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
    const existingPlaylist = await db.playlist.findUnique({
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
export const addProblemToPlaylistService = async (playlistId, problemId) => {
    const problemInPlaylist = await db.problemInPlaylist.createMany({
        data: problemId.map((id) => ({
            playlistId,
            problemId: id,
        })),
    });
    return new ApiResponse(201, 8020, problemInPlaylist);
};
export const deletePlaylistService = async (playlistId) => {
    const deletedPlaylist = await db.playlist.delete({
        where: {
            id: playlistId,
        },
    });
    return new ApiResponse(200, 8021, deletedPlaylist);
};
export const removeProblemFromPlaylistService = async (
    playlistId,
    problemId,
) => {
    const deletedProblem = await db.problemInPlaylist.deleteMany({
        where: {
            playlistId,
            problemId: {
                in: problemId,
            },
        },
    });
    return new ApiResponse(200, 8022, deletedProblem);
};
