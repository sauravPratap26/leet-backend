import {
    addProblemToPlaylistService,
    createPlaylistService,
    deletePlaylistService,
    editPlaylistDetailsService,
    getAllListDetailsService,
    getBasicPlaylistInfoService,
    getPlayListDetailsService,
    removeProblemFromPlaylistService,
} from "../services/playlist.service.js";
import asyncHandler from "../utils/async-handler.js";

export const getAllListDetails = asyncHandler(async (req, res) => {
    const details = await getAllListDetailsService(req.user.id);
    return res.status(details.statusCode).send(details);
});
export const getPlayListDetails = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const playListId = req.params.id;
    const roomId = req.params.roomId;
    const playlist = await getPlayListDetailsService(
        playListId,
        userId,
        roomId,
    );
    return res.status(playlist.statusCode).send(playlist);
});

export const getRoomPlayLists = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const details = await getAllListDetailsService(req.user.id, id);
    return res.status(details.statusCode).send(details);
});
export const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, roomId } = req.body;
    let userId = req.user.id;
    const result = await createPlaylistService(
        name,
        description,
        userId,
        roomId,
    );
    res.status(result.statusCode).send(result);
});
export const editPlaylistDetails = asyncHandler(async (req, res) => {
    const { id, name, description } = req.body;
    let userId = req.user.id;
    const result = await editPlaylistDetailsService(
        name,
        description,
        userId,
        id,
    );
    res.status(result.statusCode).send(result);
});
export const addProblemToPlaylist = asyncHandler(async (req, res) => {
    const { problemIds, playListId, roomId } = req.body;
    const result = await addProblemToPlaylistService(
        playListId,
        problemIds,
        roomId,
    );
    return res.status(result.statusCode).send(result);
});
export const deletePlaylist = asyncHandler(async (req, res) => {
    const playlistId = req.body.id;
    const roomId = req.body.roomId;
    const userId = req.user.id;
    const result = await deletePlaylistService({ playlistId, userId, roomId });
    return res.status(result.statusCode).send(result);
});
export const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
    const { playListId, problemIds } = req.body;
    const result = await removeProblemFromPlaylistService(
        playListId,
        problemIds,
    );
    return res.status(result.statusCode).send(result);
});

export const getBasicPlaylistInfo = asyncHandler(async (req, res) => {
    const { id, roomId } = req.params;
    const userId = req.user.id;
    const result = await getBasicPlaylistInfoService({ userId, id, roomId });
    return res.status(result.statusCode).send(result);
});
