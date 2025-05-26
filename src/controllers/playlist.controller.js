import {
    addProblemToPlaylistService,
    createPlaylistService,
    deletePlaylistService,
    editPlaylistDetailsService,
    getAllListDetailsService,
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
    const playlist = await getPlayListDetailsService(playListId, userId);
    return res.status(playlist.statusCode).send(playlist);
});
export const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    let userId = req.user.id;
    const result = await createPlaylistService(name, description, userId);
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
    console.log(req.body);
    const { problemIds, playListId } = req.body;
    const result = await addProblemToPlaylistService(playListId, problemIds);
    return res.status(result.statusCode).send(result);
});
export const deletePlaylist = asyncHandler(async (req, res) => {
    const playListId = req.body.id;
    const userId = req.user.id;
    const result = await deletePlaylistService(playListId, userId);
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
