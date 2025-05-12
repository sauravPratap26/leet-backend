import {
    addProblemToPlaylistService,
    createPlaylistService,
    deletePlaylistService,
    getAllListDetailsService,
    getPlayListDetailsService,
} from "../services/playlist.service.js";
import asyncHandler from "../utils/async-handler.js";

export const getAllListDetails = asyncHandler(async (req, res) => {
    const details = await getAllListDetailsService(userId);
    return res.status(details.statusCode).send(details);
});
export const getPlayListDetails = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const playListId = req.params.id;
    const playlist = await getPlayListDetailsService(playListId, userId);
    return res.status(playlist.statusCode).send(playlist);
});
export const createPlaylist = asyncHandler(async (req, res) => {
    const { name, deescription } = req.body;
    let userId = req.user.userId;
    const result = await createPlaylistService(name, deescription, userId);
    res.status(result.statusCode).send(result);
});
export const addProblemToPlaylist = asyncHandler(async (req, res) => {
    const playListId = req.params.playListId;
    const problemIds = req.body;
    const result = await addProblemToPlaylistService(playListId, problemIds);
    return res.status(result.statusCode).send(result);
});
export const deletePlaylist = asyncHandler(async (req, res) => {
    const playListId = req.params.playListId;
    const result = await deletePlaylistService(playListId);
    return res.status(result.statusCode).send(result);
});
export const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
    const playListId = req.params.playListId;
    const problemIds = req.body;
    const result = await removeProblemFromPlaylist(playListId, problemIds);
    return res.status(result.statusCode).send(result);
});
